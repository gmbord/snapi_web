import React, { useEffect, useState } from "react";
import ActionButtons from "../modules/ActionButtons.js";
import { socket } from "../../client-socket.js";
import { get, post } from "../../utilities";
import { useLocation } from "react-router-dom";

import "./ManualView.css";

/**
 *
 */
const ManualView = (props) => {
  // Always call hooks at the top level of the component
  const [selectedDropdownRobotId, setSelectedDropdownRobotId] = useState(props.selectedRobotId);
  const [apiResponse, setApiResponse] = useState(null);
  const [isForwardsPressed, setIsForwardsPressed] = useState(false);
  const [isBackwardsPressed, setIsBackwardsPressed] = useState(false);
  const [isRaisePressed, setIsRaisePressed] = useState(false);
  const [isLowerPressed, setIsLowerPressed] = useState(false);

  useEffect(() => {
    // Fetch data from API
    fetch("/api/robots")
      .then((response) => response.json())
      .then((data) => setApiResponse(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, [selectedDropdownRobotId]); // Add selectedDropdownRobotId as a dependency

  const updateApi = () => {
    fetch("/api/robots")
      .then((response) => response.json())
      .then((data) => setApiResponse(data))
      .catch((error) => console.error("Error fetching data:", error));
  };

  if (!apiResponse || apiResponse.length === 0) {
    return <div>No data available</div>;
  }

  const allRobots = apiResponse;
  console.log(allRobots);

  const handleDropdownChange = (event) => {
    const selectedId = event.target.value; // Keep it as a string
    console.log("Selected dropdown ID:", selectedId);
    setSelectedDropdownRobotId(selectedId);
    props.setSelectedRobotId(selectedId);
  };

  const setManualControl = async () => {
    console.log("SETTING MANUAL CONTROL");
    const robot = getRobotFromId(selectedDropdownRobotId);
    console.log(robot);
    const newManualControlValue = !robot.manual_control; // Toggle the value

    await post("/api/updateRobot", {
      id: selectedDropdownRobotId,
      manual_control: newManualControlValue,
    });
    updateApi();
  };

  const setDriveForwards = async () => {
    setIsForwardsPressed(true);
    console.log("SETTING Drive Forward");
    await post("/api/updateRobot", {
      id: selectedDropdownRobotId,
      manual_drive_direction: "forwards",
    });
    updateApi();
  };

  const setDriveStop = async () => {
    setIsBackwardsPressed(false);
    setIsForwardsPressed(false);
    console.log("SETTING Drive Stop");
    await post("/api/updateRobot", {
      id: selectedDropdownRobotId,
      manual_drive_direction: "stop",
    });
    updateApi();
  };

  const setDriveBackwards = async () => {
    setIsBackwardsPressed(true);
    console.log("SETTING Drive Backwards");
    await post("/api/updateRobot", {
      id: selectedDropdownRobotId,
      manual_drive_direction: "backwards",
    });
    updateApi();
  };

  const setRaise = async () => {
    setIsRaisePressed(true);
    console.log("SETTING Raise Brushes");
    await post("/api/updateRobot", {
      id: selectedDropdownRobotId,
      manual_raise_brushes: "raise",
    });
    updateApi();
  };

  const setStop = async () => {
    setIsLowerPressed(false);
    setIsRaisePressed(false);
    console.log("SETTING Stop raising Brushes");
    await post("/api/updateRobot", {
      id: selectedDropdownRobotId,
      manual_raise_brushes: "stop",
    });
    updateApi();
  };

  const setLower = async () => {
    setIsLowerPressed(true);
    console.log("SETTING Lower Brushes");
    await post("/api/updateRobot", {
      id: selectedDropdownRobotId,
      manual_raise_brushes: "lower",
    });
    updateApi();
  };

  const setEmergencyStop = async () => {
    console.log("SETTING Emergency STOP");
    const robot = getRobotFromId(selectedDropdownRobotId);
    const newEstopValue = !robot.emergency_stop; // Toggle the value

    await post("/api/updateRobot", {
      id: selectedDropdownRobotId,
      emergency_stop: newEstopValue,
    });
    updateApi();
  };

  const setBrushing = async () => {
    console.log("SETTING Brushing");
    const robot = getRobotFromId(selectedDropdownRobotId);
    const newBrushValue = !robot.brushing; // Toggle the value

    await post("/api/updateRobot", {
      id: selectedDropdownRobotId,
      brushing: newBrushValue,
    });
    updateApi();
  };

  const getRobotFromId = (id) => {
    let found = false;
    for (const robot of apiResponse) {
      if (robot._id === id && found === false) {
        found = true;
        return robot;
      }
    }
  };

  // Use the 'id' parameter as needed in your component logic
  if (!selectedDropdownRobotId) {
    const defaultRobotId = allRobots.length > 0 ? allRobots[0]._id : null;
    setSelectedDropdownRobotId(defaultRobotId);
    props.setSelectedRobotId(defaultRobotId);
  }

  return (
    <div>
      <label htmlFor="robotDropdown">Select Robot:</label>
      <div className="ManualView-button">
        <select id="robotDropdown" value={selectedDropdownRobotId} onChange={handleDropdownChange}>
          {/* Render options for all available robots */}
          {allRobots.map((robot) => (
            <option key={robot._id} value={robot._id}>
              {robot.onTrackId}
            </option>
          ))}
        </select>
      </div>

      {/* Button to send POST request on press and release */}
      <div className="ManualView-button">
        <button
          className="ManualView-default-button"
          onClick={setEmergencyStop}
          style={{
            backgroundColor: getRobotFromId(selectedDropdownRobotId)?.emergency_stop
              ? "#951212"
              : "green",
          }}
        >
          {getRobotFromId(selectedDropdownRobotId)?.emergency_stop
            ? "Disable Emergency Stop"
            : "Enable Emergency Stop"}
        </button>
      </div>
      <div className="ManualView-button">
        <button
          className="ManualView-default-button"
          onClick={setManualControl}
          style={{
            backgroundColor: getRobotFromId(selectedDropdownRobotId)?.manual_control
              ? "#951212"
              : "green",
          }}
        >
          {getRobotFromId(selectedDropdownRobotId)?.manual_control
            ? "Disable Manual Control"
            : "Enable Manual Control"}
        </button>
      </div>
      <div className="ManualView-button">
        <button
          style={{
            backgroundColor: isForwardsPressed ? "green" : "#951212", // Set your default color
          }}
          className="ManualView-default-button"
          onMouseDown={(e) => {
            e.preventDefault(); // Prevent default button behavior
            setDriveForwards();
          }}
          onMouseUp={() => setDriveStop()}
          onMouseLeave={() => {
            setDriveStop();
          }}
        >
          Drive Forwards (Click and Hold)
        </button>
        <button
          style={{
            backgroundColor: isBackwardsPressed ? "green" : "#951212", // Set your default color
          }}
          className="ManualView-default-button"
          onMouseDown={(e) => {
            e.preventDefault(); // Prevent default button behavior
            setDriveBackwards();
          }}
          onMouseUp={() => setDriveStop()}
          onMouseLeave={() => {
            setDriveStop();
          }}
        >
          Drive Backwards (Click and Hold)
        </button>
      </div>
      <div className="ManualView-button">
        <button
          className="ManualView-default-button"
          onClick={setBrushing}
          style={{
            backgroundColor: getRobotFromId(selectedDropdownRobotId)?.brushing
              ? "#951212"
              : "green",
          }}
        >
          {getRobotFromId(selectedDropdownRobotId)?.brushing
            ? "Activate Brushing"
            : "Deavtivate Brushing"}
        </button>
      </div>
      <div className="ManualView-button">
        <button
          style={{
            backgroundColor: isRaisePressed ? "green" : "#951212", // Set your default color
          }}
          className="ManualView-default-button"
          onMouseDown={(e) => {
            e.preventDefault(); // Prevent default button behavior
            setRaise();
          }}
          onMouseUp={() => setStop()}
          onMouseLeave={() => {
            setStop();
          }}
        >
          Raise Brushes (Click and Hold)
        </button>
        <button
          style={{
            backgroundColor: isLowerPressed ? "green" : "#951212", // Set your default color
          }}
          className="ManualView-default-button"
          onMouseDown={(e) => {
            e.preventDefault(); // Prevent default button behavior
            setLower();
          }}
          onMouseUp={() => setStop()}
          onMouseLeave={() => {
            setStop();
          }}
        >
          Lower Brushes (Click and Hold)
        </button>
      </div>
    </div>
  );
};

export default ManualView;
