import { useState, useEffect } from "react";

const bootstrap = require("bootstrap");

document.body.style.backgroundColor = "Cornsilk";

function App() {
  const [startScreen, setStartScreen] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [nameEmpty, setNameEmpty] = useState(false);
  const [roomScreen, setRoomScreen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [waiting, setWaiting] = useState(false);

  const handleClick = async () => {
    setBtnDisabled(true);
    if (firstName.length === 0) {
      setNameEmpty(true);
      setBtnDisabled(false);
    } else {
      setStartScreen(false);
      setRoomScreen(true);

      //load icon
      setLoading(true);

      setNameEmpty(false);
      setFirstName("");

      //make call to connect to websocket by calling api and getting the response of first/second user
      console.log("connecting to websocket...");
      await new Promise((resolve) => setTimeout(resolve, 5000));

      //after connection is established show breadcrumb saying connected and wait for other user to join
      setLoading(false);
      console.log("connected!");
    }
  };

  return (
    <div class="pt-5">
      <div class="container px-4 text-center pt-5">
        <h1 class="shadow-lg p-3 mb-5 bg-body-tertiary rounded display-1">
          Location Sharing
        </h1>
      </div>
      {startScreen && (
        <div class="container px-4 text-center pt-5">
          <div class="row justify-content-md-center">
            <div class="col col-lg-3">
              <div class="form-floating">
                <input
                  type="email"
                  class="form-control"
                  id="floatingInputGrid"
                  placeholder="Enter your first name..."
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                  }}
                />
                <label for="floatingInputGrid">Enter your first name...</label>
                {nameEmpty && (
                  <div class="text-danger">
                    <p class="text-center">Can't leave field empty</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div class="pt-5">
            <button
              type="button"
              class="btn btn-success btn-lg"
              disabled={btnDisabled}
              onClick={() => {
                handleClick();
              }}
            >
              Connect
            </button>
          </div>
        </div>
      )}
      {roomScreen && (
        <div class="pt-5">
          {loading && (
            <div class="d-flex justify-content-center">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
          <div></div>
        </div>
      )}
    </div>
  );
}

export default App;
