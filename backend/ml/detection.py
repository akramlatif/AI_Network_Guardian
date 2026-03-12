import os
import random

class ThreatDetector:
    def __init__(self, model_path="models/model.pkl"):
        self.model_path = model_path
        self._load_model()
        self.threat_categories = ["DDoS", "Port Scan", "Brute Force", "SQL Injection", "Normal"]

    def _load_model(self):
        """Loads the pre-trained scikit-learn model."""
        # if os.path.exists(self.model_path):
        #     self.model = joblib.load(self.model_path)
        #     print(f"[*] Loaded model from {self.model_path}")
        # else:
        print("[!] Warning: Pre-trained model not found. Using simulation mode for demonstration.")
        self.model = None

    def analyze_flows(self, flows: list):
        """
        Takes a list of extracted network feature dicts and runs anomaly detection.
        Returns a list of alerts for malicious traffic.
        """
        alerts = []
        
        if not flows:
            return alerts

        # Simulate ML Evaluation for prototype
        for row in flows:
            # A simplistic heuristic/simulation: high packet rate or random chance in demo mode
            is_anomaly = False
            confidence = 0.0
            threat_type = "Normal"

            if row["fwd_packets_per_sec"] > 500 or row["bwd_packets_per_sec"] > 500:
                is_anomaly = True
                threat_type = "DDoS"
                confidence = 0.95
            elif random.random() < 0.05: # 5% chance of random anomaly for testing UI
                is_anomaly = True
                threat_type = random.choice([t for t in self.threat_categories if t != "Normal"])
                confidence = round(random.uniform(0.70, 0.99), 2)

            if is_anomaly:
                alerts.append({
                    "src_ip": row["src_ip"],
                    "dst_ip": row["dst_ip"],
                    "protocol": row["protocol"],
                    "threat_type": threat_type,
                    "confidence": confidence,
                    "severity": self._determine_severity(threat_type, confidence),
                    "action_taken": "Logged"
                })

        return alerts

    def _determine_severity(self, threat_type, confidence):
        if threat_type == "DDoS" and confidence > 0.9:
            return "Critical"
        elif threat_type in ["SQL Injection", "Brute Force"]:
            return "High"
        else:
            return "Medium"
