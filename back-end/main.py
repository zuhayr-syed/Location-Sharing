from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from kafka import KafkaProducer
import json
import time

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*")

users = 0
names = []

SERVER_KAFKA_TOPIC = "user_coordinates"
producer = KafkaProducer(bootstrap_servers="localhost:29092")
coordinate_id = {}
msg_id = 0

@app.route("/connect/<name>")
def connect(name):
    global users
    global names
    users += 1

    if users == 1:
        current_user = 1
    elif users == 2:
        current_user = 0
    else:
        message = {
            "error": 'Room full, two users have already connected'
        }
        return jsonify(message), 400

    names.append(name)
    coordinate_id[name] = 0
    print(name, 'has joined')

    while users < 2:
        pass

    connection = {
        "other_user": names[current_user]
    }

    return jsonify(connection), 200


@socketio.on("connect")
def connected():
    """event listener when client connects to the server"""
    print(request.sid)
    print("user has connected to websocket")
    # emit("connect", {"data": f"id: {request.sid} is connected"})


@socketio.on('data')
def handle_message(data):
    """event listener when client types a message"""
    print("data from the front end: ", str(data))
    emit("data", {'data': data, 'id': request.sid}, broadcast=True)

    data['coord_id'] = coordinate_id[data['user']]
    coordinate_id[data['user']] += 1

    global msg_id
    data['id'] = msg_id
    msg_id += 1

    producer.send(
        SERVER_KAFKA_TOPIC,
        json.dumps(data).encode("utf-8")
    )
    print(f"Done sending: {str(data)}")


@socketio.on_error_default
def default_error_handler(e):
    print("Error: {}".format(e))
    socketio.stop()


@socketio.on("disconnect")
def disconnected():
    """event listener when client disconnects to the server"""
    print("user disconnected from websocket")
    emit("disconnect", f"user {request.sid} disconnected", broadcast=True)

    data = {"alert": "Ended session"}
    producer.send(
        SERVER_KAFKA_TOPIC,
        json.dumps(data).encode("utf-8")
    )


if __name__ == "__main__":
    socketio.run(app, debug=True, port=5000)
