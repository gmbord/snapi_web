import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import RobotIndicator from "../modules/RobotIndicator.js";

import "./Map.css";

const Map = (props) => {
  return (
    <div>
      <img src="/map.png" className="Map-img"></img>
      {props.robots.map((rowData, index) => (
        <RobotIndicator
          key={index}
          rowData={rowData}
          setSelectedRobotId={props.setSelectedRobotId}
          selectedRobotId={props.selectedRobotId}
        />
      ))}
    </div>
  );
};

export default Map;
