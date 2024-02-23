import React, { useEffect, useState } from "react";
import { socket } from "../../client-socket.js";
import { get, post } from "../../utilities.js";

import "./StatsView.css";

const StatsView = (props) => {
  return (
    <div>
      <h1>This is the Stats Page</h1>
    </div>
  );
};

export default StatsView;
