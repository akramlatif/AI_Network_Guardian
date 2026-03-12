from collections import defaultdict
import time

class FeatureExtractor:
    def __init__(self):
        # We track stateful flows using a tuple (src_ip, src_port, dst_ip, dst_port, protocol)
        self.active_flows = defaultdict(self._initialize_flow_data)

    def _initialize_flow_data(self):
        """Initialization for a new network flow."""
        return {
            "start_time": time.time(),
            "fwd_packets": 0,
            "bwd_packets": 0,
            "fwd_bytes": 0,
            "bwd_bytes": 0,
            "last_packet_time": 0
        }

    def process_packet_batch(self, packets):
        """
        Takes a batch of parsed packets from the capture module and groups them into flows,
        extracting statistical features to mirror CICIDS2017 structure roughly.
        """
        extracted_features = []

        for pkt in packets:
            # Create a directional flow key
            flow_key = (pkt['src_ip'], pkt['src_port'], pkt['dst_ip'], pkt['dst_port'], pkt['protocol'])
            reverse_flow_key = (pkt['dst_ip'], pkt['dst_port'], pkt['src_ip'], pkt['src_port'], pkt['protocol'])

            # Determine direction
            if flow_key in self.active_flows:
                flow = self.active_flows[flow_key]
                flow["fwd_packets"] += 1
                flow["fwd_bytes"] += pkt["length"]
            elif reverse_flow_key in self.active_flows:
                flow = self.active_flows[reverse_flow_key]
                flow["bwd_packets"] += 1
                flow["bwd_bytes"] += pkt["length"]
            else:
                flow = self.active_flows[flow_key]
                flow["fwd_packets"] += 1
                flow["fwd_bytes"] += pkt["length"]

            flow["last_packet_time"] = pkt["timestamp"]

        # We will periodically extract older flows or current states as features
        for key, data in list(self.active_flows.items()):
            duration = max(data["last_packet_time"] - data["start_time"], 0.001) # Avoid division by zero
            
            features = {
                "src_ip": key[0],
                "dst_ip": key[2],
                "protocol": key[4],
                "flow_duration": duration,
                "total_fwd_packets": data["fwd_packets"],
                "total_bwd_packets": data["bwd_packets"],
                "total_fwd_bytes": data["fwd_bytes"],
                "total_bwd_bytes": data["bwd_bytes"],
                "fwd_packets_per_sec": data["fwd_packets"] / duration,
                "bwd_packets_per_sec": data["bwd_packets"] / duration,
            }
            extracted_features.append(features)
            
            # Flush flows older than 60 seconds to prevent unbounded memory growth
            if time.time() - data["last_packet_time"] > 60:
                del self.active_flows[key]

        return extracted_features
