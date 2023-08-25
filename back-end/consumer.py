from kafka import KafkaConsumer
import json
import psycopg2

hostname = 'localhost'
database = 'coordinates'
username = 'postgres'
pwd = 'admin'
port_id = 5432

SERVER_KAFKA_TOPIC = "user_coordinates"

consumer = KafkaConsumer(
    SERVER_KAFKA_TOPIC,
    bootstrap_servers="localhost:29092"
)

conn = None
cur = None

if __name__ == "__main__":
    try:
        conn = psycopg2.connect(
            host=hostname,
            dbname=database,
            user=username,
            password=pwd,
            port=port_id
        )
        cur = conn.cursor()
        print("Connected to database")

        print("Consumer listening...")
        itr = 0
        track = 0
        create_db = True
        while True:
            for message in consumer:
                if create_db:
                    create_db = False
                    print(f"Created database session{str(itr)}")
                    create_script = ''' CREATE TABLE IF NOT EXISTS session{} (
                                            id  SERIAL PRIMARY KEY,
                                            user_name    VARCHAR(40) NOT NULL,
                                            coord_id    INT NOT NULL,
                                            user_coord_id   INT NOT NULL,
                                            latitude    FLOAT,
                                            longitude   FLOAT
                                    ) '''.format(str(itr))
                    cur.execute(create_script)
                    conn.commit()

                print("Reading data...")
                consumed_message = json.loads(message.value.decode())
                print(f"Consumed message: {str(consumed_message)}")

                if 'alert' in consumed_message:
                    track += 1
                    if track > 1:
                        track = 0
                        itr += 1
                        create_db = True
                        print("Current session has ended")
                else:
                    insert_script = 'INSERT INTO session{} (user_name, coord_id, user_coord_id, latitude, longitude) VALUES (%s, %s, %s, %s, %s)'.format(
                        str(itr))
                    insert_values = (consumed_message['user'], consumed_message['id'],
                                     consumed_message['coord_id'], consumed_message['Latitude'],
                                     consumed_message['Longitude'])

                    cur.execute(insert_script, insert_values)
                    conn.commit()

    except Exception as error:
        print(error)
    finally:
        if cur is not None:
            cur.close()
        if conn is not None:
            conn.close()
        print("Disconnected from database")
