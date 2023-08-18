import { useState, useEffect } from "react";

const bootstrap = require("bootstrap");

document.body.style.backgroundColor = "Cornsilk";

const coords = [
  { Latitude: 32.223, Longitude: -72.54 },
  { Latitude: 52.223, Longitude: -84.54 },
  { Latitude: 62.223, Longitude: -63.54 },
  { Latitude: 72.223, Longitude: -63.54 },
  { Latitude: 82.223, Longitude: -63.54 },
  { Latitude: 92.223, Longitude: -63.54 },
  { Latitude: 93.223, Longitude: -63.54 },
  { Latitude: 94.223, Longitude: -63.54 },
  { Latitude: 95.223, Longitude: -63.54 },
  { Latitude: 96.223, Longitude: -63.54 },
  { Latitude: 97.223, Longitude: -63.54 },
  { Latitude: 98.223, Longitude: -63.54 },
  { Latitude: 99.223, Longitude: -63.54 },
];
const coords2 = [
  { Latitude: 22.223, Longitude: -62.54 },
  { Latitude: 12.223, Longitude: -94.54 },
  { Latitude: 42.223, Longitude: -83.54 },
];

function App() {
  const [startScreen, setStartScreen] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [nameEmpty, setNameEmpty] = useState(false);
  const [roomScreen, setRoomScreen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [otherName, setOtherName] = useState("waiting for other user...");

  const handleClick = async () => {
    setBtnDisabled(true);
    if (firstName.length === 0) {
      setNameEmpty(true);
      setBtnDisabled(false);
    } else {
      setStartScreen(false);
      setRoomScreen(true);
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
        <div class="pt-2">
          {loading ? (
            <div class="container text-center pt-5">
              <div class="row">
                <div class="col align-self-center">
                  <div class="spinner-border col-3 p-3 mb-2" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div>
              </div>
              <div class="row pt-2">
                <div class="col align-self-center">
                  <p>Connecting to websocket...</p>
                </div>
              </div>
            </div>
          ) : (
            <div class="container text-center">
              <div class="row">
                <div class="col">
                  <div class="text-center">
                    <p class="fs-2 shadow-sm p-3 mb-5 bg-body-tertiary rounded display-1">
                      Your Coordinates
                    </p>
                    <p class="fs-3">
                      <span class="p-5">
                        Latitude: {coords.toReversed()[0].Latitude}
                      </span>
                      <span>Longitude: {coords.toReversed()[0].Longitude}</span>
                    </p>
                    <div
                      class="shadow-sm p-3 bg-body-tertiary rounded"
                      style={{ height: "50vh", overflow: "scroll" }}
                    >
                      <ul class="list-group">
                        {coords.toReversed().map((item) => (
                          <li class="list-group-item">
                            <span class="p-5">Latitude: {item.Latitude}</span>
                            <span>Longitude: {item.Longitude}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="col">
                  {" "}
                  <div class="text-center">
                    <p class="fs-2 shadow-sm p-3 mb-5 bg-body-tertiary rounded display-1">
                      {otherName}
                    </p>
                    {!waiting ? (
                      <span>
                        <p class="fs-3">
                          <span class="p-5">
                            Latitude: {coords2.toReversed()[0].Latitude}
                          </span>
                          <span>
                            Longitude: {coords2.toReversed()[0].Longitude}
                          </span>
                        </p>
                        <div
                          class="shadow-sm p-3 bg-body-tertiary rounded"
                          style={{ height: "50vh", overflow: "scroll" }}
                        >
                          <ul class="list-group">
                            {coords2.toReversed().map((item) => (
                              <li class="list-group-item">
                                <span class="p-5">
                                  Latitude: {item.Latitude}
                                </span>
                                <span>Longitude: {item.Longitude}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </span>
                    ) : (
                      <div class="spinner-border col-3 p-3 mb-2" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
