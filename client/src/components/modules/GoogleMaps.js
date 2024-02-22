import React, { useEffect, useRef, useState } from "react";
import "./GoogleMaps.css";

const GoogleMaps = ({ robots, selectedRobotId, setSelectedRobotId }) => {
  const mapRef = useRef(null);
  const markers = useRef({});
  const [waypoints, setWaypoints] = useState([]);
  const [creatingMission, setCreatingMission] = useState(false);
  const selectedRobotMarkerColor = "red"; // Customize the color for the selected robot marker

  useEffect(() => {
    const initializeMap = () => {
      if (window.google && window.google.maps) {
        const mapOptions = {
          center: { lat: 42.3601, lng: -71.0589 },
          zoom: 12,
          mapTypeId: "roadmap",
        };

        const newMap = new window.google.maps.Map(mapRef.current, mapOptions);
        return newMap;
      }

      return null;
    };

    const map = initializeMap();

    if (map) {
      // Handle markers for all robots
      robots.forEach((robot) => {
        const [latStr, lonStr] = robot.gps.split(",").map((s) => s.trim().replace("°", ""));
        const lat = parseFloat(latStr);
        const lon = parseFloat(lonStr);

        if (!isNaN(lat) && !isNaN(lon)) {
          const markerOptions = {
            position: { lat, lng: -lon },
            map,
            title: String(robot.onTrackId),
            label: {
              text: String(robot.onTrackId),
              color: "white",
              fontSize: "12px",
              fontWeight: "bold",
            },
          };

          // If creatingMission is true, hide markers for non-selected robots
          if (!creatingMission || robot._id === selectedRobotId) {
            if (robot._id === selectedRobotId) {
              // Customize the color for the selected robot marker
              markerOptions.icon = {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: selectedRobotMarkerColor,
                fillOpacity: 1,
                strokeWeight: 1,
                strokeColor: "black",
              };
            }

            const marker = new window.google.maps.Marker(markerOptions);

            marker.addListener("click", () => {
              setSelectedRobotId(robot._id);
            });

            markers.current[robot._id] = marker;
          }
        } else {
          console.error(`Invalid GPS coordinates for robot ${robot._id}: ${robot.gps}`);
        }
      });

      // Handle waypoint creation when creatingMission state is true
      if (creatingMission) {
        const clickListener = map.addListener("click", (event) => {
          const lat = event.latLng.lat();
          const lon = -event.latLng.lng(); // Invert the longitude for W (West)

          setWaypoints((prevWaypoints) => [...prevWaypoints, { lat, lon }]);
        });

        // Display markers for existing waypoints
        waypoints.forEach((waypoint, index) => {
          const markerOptions = {
            position: { lat: waypoint.lat, lng: -waypoint.lon },
            map,
            title: `Waypoint ${index + 1}`,
          };

          const marker = new window.google.maps.Marker(markerOptions);
          markers.current[`waypoint${index}`] = marker;
        });

        return () => {
          // Remove click listener when component unmounts or creatingMission is false
          window.google.maps.event.removeListener(clickListener);
        };
      }
    }

    return () => {
      // Clean up markers when component unmounts
      Object.values(markers.current).forEach((marker) => marker.setMap(null));
    };
  }, [
    robots,
    selectedRobotId,
    setSelectedRobotId,
    creatingMission,
    waypoints,
    selectedRobotMarkerColor,
  ]);

  const handleNewMissionClick = () => {
    setWaypoints([]);
    setCreatingMission(true);
  };

  const handleCreateAndUploadClick = async () => {
    // Assuming you have an API endpoint at /api/mission to create a new mission
    const newMission = {
      waypoints: waypoints.map((waypoint) => `${waypoint.lat},${waypoint.lon}`),
      robot: selectedRobotId,
    };

    try {
      const response = await fetch("/api/mission", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMission),
      });

      if (response.ok) {
        // Mission created successfully, you may want to handle success accordingly
        console.log("Mission created successfully!");
      } else {
        // Handle error response from the server
        console.error("Failed to create mission:", response.statusText);
      }
    } catch (error) {
      // Handle network or other errors
      console.error("Error creating mission:", error.message);
    }

    // Reset state after creating and uploading the mission
    setWaypoints([]);
    setCreatingMission(false);
  };

  const handleCancelMissionClick = () => {
    // Reset waypoints to an empty array
    setWaypoints([]);
    // Show markers for all robots again
    robots.forEach((robot) => {
      const marker = markers.current[robot._id];
      if (marker) {
        marker.setMap(mapRef.current);
      }
    });
    // Cancel creating the mission
    setCreatingMission(false);
  };

  return (
    <div>
      <button
        className="GoogleMaps-button"
        onClick={handleNewMissionClick}
        disabled={creatingMission}
      >
        New Mission
      </button>
      {creatingMission && (
        <>
          <button
            className="GoogleMaps-button"
            onClick={handleCreateAndUploadClick}
            disabled={waypoints.length === 0}
          >
            Create and Upload
          </button>
          <button className="GoogleMaps-button" onClick={handleCancelMissionClick}>
            Cancel
          </button>
        </>
      )}
      <div ref={mapRef} style={{ height: "600px", width: "100%" }} />
    </div>
  );
};

export default GoogleMaps;
