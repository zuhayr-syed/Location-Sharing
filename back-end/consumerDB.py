from kafka import KafkaConsumer
import json

SERVER_KAFKA_TOPIC = "user_coordinates"

consumer = KafkaConsumer(
    SERVER_KAFKA_TOPIC,
    bootstrap_servers="localhost:29092"
)

if __name__ == "__main__":
    print("Consumer listening...")
    while True:
        for message in consumer:
            print("Ongoing transaction...")
            consumed_message = json.loads(message.value.decode())
            print(f"Consumed message: {str(consumed_message)}")
