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
      <img className="InfoView-robit" src="/product_sheet.png"></img>
    </div>
  );
};

export default InfoView;
