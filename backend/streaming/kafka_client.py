import json
import threading
from confluent_kafka import Producer, Consumer, KafkaError

class KafkaStreamManager:
    def __init__(self, bootstrap_servers='localhost:9092'):
        self.bootstrap_servers = bootstrap_servers
        self.producer = None
        self.consumer = None
        self.is_running = False

    def init_producer(self):
        """Initializes the Kafka Producer for sending packet data."""
        conf = {'bootstrap.servers': self.bootstrap_servers}
        try:
            self.producer = Producer(**conf)
            print("[*] Kafka Producer initialized.")
        except Exception as e:
            print(f"[!] Failed to initialize Kafka Producer: {e}")

    def produce_flow_data(self, topic, data: dict):
        """Sends extracted flow data to a Kafka topic."""
        if not self.producer:
            return
            
        try:
            # Produce asynchronously
            self.producer.produce(topic, value=json.dumps(data).encode('utf-8'))
            self.producer.poll(0) # Serve delivery callbacks
        except Exception as e:
            print(f"[!] Kafka production error: {e}")

    def init_consumer(self, group_id, topics):
        """Initializes the Kafka Consumer for listening to anomaly alerts."""
        conf = {
            'bootstrap.servers': self.bootstrap_servers,
            'group.id': group_id,
            'auto.offset.reset': 'earliest'
        }
        try:
            self.consumer = Consumer(**conf)
            self.consumer.subscribe(topics)
            print(f"[*] Kafka Consumer subscribed to {topics}.")
        except Exception as e:
            print(f"[!] Failed to initialize Kafka Consumer: {e}")

    def start_consuming(self, callback):
        """Starts a background thread to consume messages."""
        if not self.consumer:
            return
            
        self.is_running = True
        thread = threading.Thread(target=self._consume_loop, args=(callback,))
        thread.daemon = True
        thread.start()

    def _consume_loop(self, callback):
        """Internal consumption loop."""
        while self.is_running:
            msg = self.consumer.poll(timeout=1.0)
            if msg is None:
                continue
            if msg.error():
                if msg.error().code() == KafkaError._PARTITION_EOF:
                    # End of partition
                    continue
                else:
                    print(msg.error())
                    break
            
            # Message successfully received
            try:
                data = json.loads(msg.value().decode('utf-8'))
                callback(data)
            except Exception as e:
                print(f"[!] Error processing Kafka message: {e}")

    def close(self):
        """Drains the producer and closes the consumer."""
        self.is_running = False
        if self.producer:
            self.producer.flush()
        if self.consumer:
            self.consumer.close()

# Singleton instance for the backend
kafka_manager = KafkaStreamManager()
