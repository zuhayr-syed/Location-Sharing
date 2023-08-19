from flask import Flask, request, jsonify

app = Flask(__name__)

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

    # create websocket

    print('websocket created for', name)

    while users < 2:
        pass

    connection = {
        "other_user": names[current_user]
    }

    return jsonify(connection), 200


if __name__ == "__main__":
    app.run(debug=True)