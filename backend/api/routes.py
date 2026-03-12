from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List
import time
import asyncio
import json
import random

router = APIRouter()

# Global state mock instances for the routes to pull from
# In a real app, these would be initialized in main.py and passed down or managed via DI
from sniffer.capture import PacketSniffer
from sniffer.extractor import FeatureExtractor
from ml.detection import ThreatDetector

# We will instantiate them here for prototype simplicity
sniffer = PacketSniffer()
extractor = FeatureExtractor()
detector = ThreatDetector()

# Start sniffing immediately upon API load (for demo)
sniffer.start_sniffing()

@router.get("/traffic/stats")
async def get_traffic_stats():
    """Returns current bandwidth and active connections."""
    recent_packets = sniffer.get_recent_packets(500)
    
    bytes_transferred = sum(p["length"] for p in recent_packets)
    nodes = set([p["src_ip"] for p in recent_packets] + [p["dst_ip"] for p in recent_packets])
    
    return {
        "current_bandwidth_bps": bytes_transferred * 8, # mock translation relative to collection window
        "active_nodes": len(nodes),
        "total_packets": len(recent_packets)
    }

@router.get("/threats/recent")
async def get_recent_threats(limit: int = 10):
    """Processes recent flows through the ML model and returns alerts."""
    recent_packets = sniffer.get_recent_packets(100)
    flows_df = extractor.process_packet_batch(recent_packets)
    alerts = detector.analyze_flows(flows_df)
    
    # Send highest confidence threats first
    sorted_alerts = sorted(alerts, key=lambda x: x['confidence'], reverse=True)
    return sorted_alerts[:limit]

# List of active websocket connections for logs
active_connections: List[WebSocket] = []

@router.websocket("/logs/stream")
async def websocket_endpoint(websocket: WebSocket):
    """Streams live log data and system events to the frontend."""
    await websocket.accept()
    active_connections.append(websocket)
    try:
        while True:
            # Emit a heartbeat log or sniffer status periodically
            log_event = {
                "timestamp": time.time(),
                "level": "INFO",
                "message": f"Sniffer active. Buffered {len(sniffer.packet_buffer)} packets."
            }
            
            # Simulated Random Warnings for UI
            if random.random() < 0.1:
                 log_event = {
                    "timestamp": time.time(),
                    "level": random.choice(["WARNING", "CRITICAL"]),
                    "message": "Anomaly threshold crossed in sector 7G."
                 }

            await websocket.send_text(json.dumps(log_event))
            await asyncio.sleep(2)
    except WebSocketDisconnect:
        active_connections.remove(websocket)
