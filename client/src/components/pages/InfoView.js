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
      <h1>THIS IS THE INFO VIEW</h1>
    </div>
  );
};

export default InfoView;
