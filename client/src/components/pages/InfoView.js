import React, { useEffect, useState } from "react";
import { socket } from "../../client-socket.js";
import { get, post } from "../../utilities.js";

import "./InfoView.css";

/**
 *
 */
const InfoView = ({ userId }) => {
  return (
    <div className="InfoView-container">
      <h1>DKE SNAPPA</h1>
      <h2>Login With Google To Get Started</h2>
      <h1></h1>
      <h3>Left Button: Toss</h3>
      <h3>Middle Button: Catch</h3>
      <h3>Right Button: Drop</h3>
      <h3>Furthest Right Button (on right river seat): Point no Drop</h3>
      <p>Brought to you by G$ & AT</p>
    </div>
  );
};

export default InfoView;
