import React, { useEffect, useState } from "react";
import Map from "../modules/Map.js";
import MapPopup from "../modules/MapPopup.js";
import NewMissionPopup from "../modules/NewMissionPopup.js";
import GoogleMaps from "../modules/GoogleMaps";
import RobotIndicator from "../modules/RobotIndicator.js";
import { socket } from "../../client-socket.js";
import { get, post } from "../../utilities";
import RobotRow from "../modules/RobotRow.js";

import "./MapView.css";

/**
 *
 */
const MapView = (props) => {
  const [apiRobots, setApiRobots] = useState(null);
  const [rowData, setRowData] = useState(null);

  useEffect(() => {
    // Fetch data from API
    fetch("/api/robots")
      .then((response) => response.json())
      .then((data) => setApiRobots(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    if (!apiRobots) {
      setRowData(null);
    } else {
      for (const rob of apiRobots) {
        if (rob._id == props.selectedRobotId) {
          setRowData(rob);
        }
      }
    }
  });

  if (!apiRobots || apiRobots.length === 0) {
    return <div>No data available</div>;
  }

  if (!props.selectedRobotId) {
    const defaultRobotId = apiRobots.length > 0 ? apiRobots[0]._id : null;
    props.setSelectedRobotId(defaultRobotId);
  }

  // Check if the Google Maps API is loaded
  if (!window.google || !window.google.maps) {
    return <div>Loading Google Maps...</div>;
  }
  if (!props.selectedRobotId) {
    const defaultRobotId = apiRobots.length > 0 ? apiRobots[0]._id : null;
    props.setSelectedRobotId(defaultRobotId);
  }

  return (
    <div>
      <h1>Google Maps View</h1>
      <GoogleMaps
        robots={apiRobots}
        selectedRobotId={props.selectedRobotId}
        setSelectedRobotId={props.setSelectedRobotId}
      />
      <div className="StatusView-container">
        <div className="StatusView-header">OnTrack ID</div>
        <div className="StatusView-header">Battery</div>
        <div className="StatusView-header">GPS</div>
        <div className="StatusView-header">Brushing Status</div>
        <div className="StatusView-header">Actions</div>
      </div>
      <div>
        <RobotRow
          rowData={rowData}
          setSelectedRobotId={props.setSelectedRobotId}
          selectedRobotId={props.selectedRobotId}
        />
      </div>
    </div>
  );
};

export default MapView;
