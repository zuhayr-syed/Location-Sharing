from flask import Flask, request, jsonify
from flask_socketio import SocketIO,emit
from flask_cors import CORS

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*")

users = 0
names = []


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


@socketio.on_error_default
def default_error_handler(e):
    print("Error: {}".format(e))
    socketio.stop()


@socketio.on("disconnect")
def disconnected():
    """event listener when client disconnects to the server"""
    print("user disconnected from websocket")
    emit("disconnect", f"user {request.sid} disconnected", broadcast=True)


if __name__ == "__main__":
    socketio.run(app, debug=True, port=5000)
