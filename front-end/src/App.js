import { useState, useEffect } from "react";

const bootstrap = require("bootstrap");

document.body.style.backgroundColor = "Cornsilk";

function App() {
  const [startScreen, setStartScreen] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [nameEmpty, setNameEmpty] = useState(false);

  const handleClick = () => {
    if (firstName.length === 0) {
      setNameEmpty(true);
    } else {
      setNameEmpty(false);
      setFirstName("");
      //make call to connect to websocket
      console.log(firstName);
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
    </div>
  );
}

export default App;
