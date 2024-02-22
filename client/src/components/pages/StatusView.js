import React, { useEffect, useState } from "react";
import RobotRow from "../modules/RobotRow.js";
import ActionButtons from "../modules/ActionButtons.js";
import { socket } from "../../client-socket.js";
import { get, post } from "../../utilities";

import "./StatusView.css";

/**
 *
 */
const StatusView = ({ setSelectedRobotId }) => {
  console.log("Printing Set selected id");
  console.log(setSelectedRobotId);
  const [apiResponse, setApiResponse] = useState(null);

  useEffect(() => {
    // Fetch data from API
    fetch("/api/robots")
      .then((response) => response.json())
      .then((data) => setApiResponse(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  if (!apiResponse || apiResponse.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <div>
      {/* Header Container */}
      <div className="StatusView-container">
        <div className="StatusView-header">OnTrack ID</div>
        <div className="StatusView-header">Battery</div>
        <div className="StatusView-header">GPS</div>
        <div className="StatusView-header">Brushing Status</div>
        <div className="StatusView-header">Actions</div>
      </div>
      {apiResponse.map((rowData, index) => (
        <RobotRow key={index} rowData={rowData} setSelectedRobotId={setSelectedRobotId} />
      ))}
    </div>
  );

  // .then((robots) => {
  //   //

  // });
};

export default StatusView;
