import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import jwt_decode from "jwt-decode";

import NavBar from "./modules/NavBar.js";
import MapView from "./pages/MapView.js";
import StatusView from "./pages/StatusView.js";
import ManualView from "./pages/ManualView.js";
import NotFound from "./pages/NotFound.js";
import Skeleton from "./pages/Skeleton.js";
import InfoView from "./pages/InfoView.js";
import RobotRow from "./modules/RobotRow.js";
import Settings from "./pages/Settings.js";
import "../utilities.css";

import { socket } from "../client-socket.js";
import { get, post } from "../utilities";

/**
 * Define the "App" component
 */
const App = () => {
  const [userId, setUserId] = useState(undefined);

  useEffect(() => {
    get("/api/whoami").then((user) => {
      if (user._id) {
        // they are registed in the database, and currently logged in.
        setUserId(user._id);
      }
    });
  }, []);

  const handleLogin = (credentialResponse) => {
    const userToken = credentialResponse.credential;
    const decodedCredential = jwt_decode(userToken);
    console.log(`Logged in as ${decodedCredential.name}`);
    post("/api/login", { token: userToken }).then((user) => {
      setUserId(user._id);
      post("/api/initsocket", { socketid: socket.id });
    });
  };

  const handleLogout = () => {
    setUserId(undefined);
    post("/api/logout");
  };

  const [selectedRobotId, setSelectedRobotId] = useState(null);

  // Check if the user is not logged in and redirect to "/"
  if (!userId) {
    return (
      <>
        <NavBar handleLogin={handleLogin} handleLogout={handleLogout} userId={userId} />
        <div className="App-container">
          <Routes>
            <Route path="/" element={<InfoView path="/info" />} />
            <Route path="*" element={<InfoView to="/" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar handleLogin={handleLogin} handleLogout={handleLogout} userId={userId} />
      <div className="App-container">
        <Routes>
          <Route path="/" element={<InfoView path="/info" />} />
          <Route
            path="/map"
            element={
              <MapView
                path="/map"
                selectedRobotId={selectedRobotId}
                setSelectedRobotId={setSelectedRobotId}
              />
            }
          />
          <Route
            path="/status"
            element={<StatusView path="/status" setSelectedRobotId={setSelectedRobotId} />}
          />
          <Route
            path="/manualControl"
            element={
              <ManualView
                path="/manualControl"
                selectedRobotId={selectedRobotId}
                setSelectedRobotId={setSelectedRobotId}
              />
            }
          />
          <Route path="/settings" element={<Settings path="/settings"></Settings>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
