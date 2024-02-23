import React, { useEffect, useState } from "react";
import { socket } from "../../client-socket.js";
import { get, post } from "../../utilities.js";

import "./ActiveGameView.css";

const ActiveGameView = (props) => {
  return (
    <div>
      <h1>This is the Active Game Page</h1>
    </div>
  );
};

export default ActiveGameView;
