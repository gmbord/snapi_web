import React, { useEffect, useState } from "react";
import "./RobotRow.css";
import { Routes, Route, Link } from "react-router-dom";

const RobotIndicator = (props) => {
  return (
    <div>
      {"ID: " + props.rowData.onTrackId}
      {"  GPS:" + props.rowData.gps}
    </div>
  );
};

export default RobotIndicator;
