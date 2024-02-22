import React, { useEffect, useState } from "react";
import "./RobotRow.css";
import { Routes, Route, Link } from "react-router-dom";

// @param {RobotRowData} data

const RobotRow = (props) => {
  console.log("printing props");
  console.log(props);
  if (!props.rowData) {
    return <div>No data available</div>;
  }
  const batteryStyle =
    props.rowData.battery > 50 ? "green" : props.rowData.battery < 25 ? "red" : "black";

  const brushingStyle = props.rowData.brushing === true ? "green" : "red";
  const brush = props.rowData.brushing === true ? "Activated" : "Deactivated";
  const rowData = props.rowData;

  const handleManualControlClick = () => {
    // Set the selectedRobotId state with the ID of the clicked robot
    props.setSelectedRobotId(props.rowData._id);
  };

  return (
    <div className="RobotRow-container">
      {/* Display data under respective headers */}
      <div className="RobotRow-item">{props.rowData.onTrackId}</div>
      <div className="RobotRow-item" style={{ color: batteryStyle, fontWeight: "bold" }}>
        {props.rowData.battery + "%"}

        {props.rowData.charging && (
          <img src="/charging.png" className="RobotRow-charging" alt="Charging" />
        )}
      </div>
      <div className="RobotRow-item">{props.rowData.gps}</div>
      <div className="RobotRow-item" style={{ color: brushingStyle, fontWeight: "bold" }}>
        {brush}
      </div>
      {/* Add actions as needed */}
      <div className="RobotRow-actions">
        <Link to={{ pathname: "/map", state: { rowData } }}>
          <button className="RobotRow-button" onClick={handleManualControlClick}>
            View on Map
          </button>
        </Link>
        <Link to={{ pathname: "/manualControl", state: { rowData } }}>
          <button className="RobotRow-button" onClick={handleManualControlClick}>
            Manual Control
          </button>
        </Link>

        {/* Add more actions if needed */}
      </div>
    </div>
  );
};

export default RobotRow;
