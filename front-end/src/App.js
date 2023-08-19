import { useState, useEffect } from "react";
import axios from "axios";

const bootstrap = require("bootstrap");
const baseURL = "http://127.0.0.1:5000/connect/";

document.body.style.backgroundColor = "Cornsilk";

function App() {
  const [startScreen, setStartScreen] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [nameEmpty, setNameEmpty] = useState(false);
  const [roomScreen, setRoomScreen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [waiting, setWaiting] = useState(true);
  const [otherName, setOtherName] = useState("waiting for other user...");

  const [coords, setCoords] = useState([]);
  const [coords2, setCoords2] = useState([]);

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
      // setFirstName("");

      //make call to connect to websocket by calling api and getting the response of first/second user
      console.log("waiting for other user...");
      await axios.get(baseURL + firstName).then((response) => {
        setOtherName(response.data.other_user);
        setLoading(false);
      });
      console.log("both users connected to server!");

      await new Promise((resolve) => setTimeout(resolve, 2000)); //connect to websocket

      setWaiting(false);
    }
  };

  const getCoords = () => {
    navigator.geolocation.getCurrentPosition(function (position) {
      console.log("Latitude is :", position.coords.latitude);
      console.log("Longitude is :", position.coords.longitude);

      setCoords((coords) => [
        ...coords,
        {
          Latitude: position.coords.latitude,
          Longitude: position.coords.longitude,
        },
      ]);

      //send coords to websocket
      console.log(coords);
    });
  };

  useEffect(() => {
    if (!waiting) {
      setInterval(getCoords, 10000);
    }
  }, [waiting]);

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
                  <p>Waiting for other user to connect...</p>
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
                      <span>
                        Latitude:{" "}
                        {coords.length > 0
                          ? coords.toReversed()[0].Latitude
                          : "-- "}
                        {" / "}
                      </span>
                      <span>
                        Longitude:{" "}
                        {coords.length > 0
                          ? coords.toReversed()[0].Longitude
                          : "--"}
                      </span>
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
                      {"'s Coordinates"}
                    </p>
                    {!waiting ? (
                      <span>
                        <p class="fs-3">
                          <span>
                            Latitude:{" "}
                            {coords2.length > 0
                              ? coords2.toReversed()[0].Latitude
                              : "-- "}
                            {" / "}
                          </span>
                          <span>
                            Longitude:{" "}
                            {coords2.length > 0
                              ? coords2.toReversed()[0].Longitude
                              : "--"}
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
                      <div class="container text-center pt-5">
                        <div class="row">
                          <div class="col align-self-center">
                            <div
                              class="spinner-border col-3 p-3 mb-2"
                              role="status"
                            >
                              <span class="visually-hidden">Loading...</span>
                            </div>
                          </div>
                        </div>
                        <div class="row pt-2">
                          <div class="col align-self-center">
                            <p>Waiting for other user to connect...</p>
                          </div>
                        </div>
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
