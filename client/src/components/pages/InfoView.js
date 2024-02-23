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
      <h2>LOGIN WITH GOOGLE TO GET STARTED</h2>
    </div>
  );
};

export default InfoView;
