import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import jwt_decode from "jwt-decode";

import NavBar from "./modules/NavBar.js";
import QueueView from "./pages/QueueView.js";
import ActiveGameView from "./pages/ActiveGameView.js";
import StatsView from "./pages/StatsView.js";
import NotFound from "./pages/NotFound.js";
import UserSettingsView from "./pages/UserSettingsView.js";
import InfoView from "./pages/InfoView.js";
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
          <Route path="/queue" element={<QueueView path="/queue" />} />
          <Route path="/active" element={<ActiveGameView path="/active" />} />
          <Route path="/stats" element={<StatsView path="/stats" />} />
          <Route
            path="/settings"
            element={<UserSettingsView path="/settings"></UserSettingsView>}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
