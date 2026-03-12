from scapy.all import sniff, IP, TCP, UDP
import threading
import time

class PacketSniffer:
    def __init__(self, interface=None):
        self.interface = interface
        self.is_sniffing = False
        self.packet_buffer = []

    def start_sniffing(self):
        """Starts the packet sniffer in a background thread."""
        if not self.is_sniffing:
            self.is_sniffing = True
            self.thread = threading.Thread(target=self._sniff_loop)
            self.thread.daemon = True
            self.thread.start()
            print(f"[*] Started packet sniffing on interface: {self.interface or 'default'}")

    def stop_sniffing(self):
        """Stops the packet sniffer."""
        self.is_sniffing = False
        print("[*] Stopped packet sniffing.")

    def _sniff_loop(self):
        """Internal sniffing loop run in thread."""
        try:
            # The filter 'ip' ensures we only get IP packets.
            # prn function is called for every packet.
            # store=False keeps scapy from hoarding RAM.
            sniff(iface=self.interface, prn=self._process_packet, store=False, filter="ip", stop_filter=lambda x: not self.is_sniffing)
        except (RuntimeError, OSError, PermissionError) as e:
            print(f"[!] Native sniffing failed ({e}). Falling back to simulated traffic generation...")
            self._mock_sniff_loop()

    def _mock_sniff_loop(self):
        """Generates fake network traffic for demonstration if Npcap is missing."""
        import random
        while self.is_sniffing:
            # Simulate a continuous stream of packets
            for _ in range(random.randint(10, 50)):
                src_ip = f"192.168.1.{random.randint(2, 254)}"
                dst_ip = random.choice(["8.8.8.8", "1.1.1.1", "10.0.0.5", "192.168.1.100"])
                protocol = random.choice(["TCP", "TCP", "UDP", "Other"])
                length = random.randint(40, 1500)
                
                # Simulate a burst of traffic from external IPs (like a scan or DDoS)
                if random.random() < 0.05:
                     src_ip = f"{random.randint(1,254)}.{random.randint(1,254)}.{random.randint(1,254)}.{random.randint(1,254)}"
                     dst_ip = "192.168.1.10" # Target server
                     length = random.randint(1000, 1500)
                
                flow_data = {
                    "timestamp": time.time(),
                    "src_ip": src_ip,
                    "dst_ip": dst_ip,
                    "src_port": random.randint(1024, 65535),
                    "dst_port": random.choice([80, 443, 22, 53, 3306]),
                    "protocol": protocol,
                    "length": length
                }
                self.packet_buffer.append(flow_data)
                
                if len(self.packet_buffer) > 10000:
                    self.packet_buffer.pop(0)

            time.sleep(1)

    def _process_packet(self, packet):
        """Processes each captured packet and buffers basic flow info."""
        if IP in packet:
            src_ip = packet[IP].src
            dst_ip = packet[IP].dst
            protocol = "Other"
            src_port = 0
            dst_port = 0
            length = len(packet)

            if TCP in packet:
                protocol = "TCP"
                src_port = packet[TCP].sport
                dst_port = packet[TCP].dport
            elif UDP in packet:
                protocol = "UDP"
                src_port = packet[UDP].sport
                dst_port = packet[UDP].dport

            flow_data = {
                "timestamp": time.time(),
                "src_ip": src_ip,
                "dst_ip": dst_ip,
                "src_port": src_port,
                "dst_port": dst_port,
                "protocol": protocol,
                "length": length
            }
            self.packet_buffer.append(flow_data)

            # Limit buffer size to prevent memory leaks in the prototype
            if len(self.packet_buffer) > 10000:
                self.packet_buffer.pop(0)

    def get_recent_packets(self, limit=100):
        """Returns the most recently captured packets."""
        return self.packet_buffer[-limit:]

if __name__ == "__main__":
    # Test the sniffer locally
    sniffer = PacketSniffer()
    sniffer.start_sniffing()
    try:
        while True:
            time.sleep(5)
            packets = sniffer.get_recent_packets(5)
            print(f"Recent {len(packets)} packets: {packets}")
    except KeyboardInterrupt:
        sniffer.stop_sniffing()
