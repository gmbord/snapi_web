import React, { useEffect, useState } from "react";
import { socket } from "../../client-socket.js";
import { get, post } from "../../utilities.js";

import "./UserSettingsView.css";

const UserSettingsView = (props) => {
  return (
    <div>
      <h1>This is the User Settings Page</h1>
    </div>
  );
};

export default UserSettingsView;
