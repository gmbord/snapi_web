import React, { useEffect, useState } from "react";
import UserRow from "../modules/UserRow.js";
import { get, post } from "../../utilities.js";
import "./Settings.css";

const Settings = (props) => {
  const [apiResponse, setApiResponse] = useState(null);

  useEffect(() => {
    // Fetch data from API
    fetch("/api/users")
      .then((response) => response.json())
      .then((data) => setApiResponse(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleRoleChange = (userId, newRole) => {
    // Update the local state
    const updatedApiResponse = apiResponse.map((user) =>
      user._id === userId ? { ...user, role: newRole } : user
    );
    setApiResponse(updatedApiResponse);

    // Make a POST request to update the user's role in the database
    post("/api/updateUser", { id: userId, role: newRole })
      .then((response) => {
        // Handle success if needed
      })
      .catch((error) => {
        console.error("Error updating user role:", error);

        // Revert the local state change in case of an error
        setApiResponse(apiResponse);
      });
  };

  if (!apiResponse || apiResponse.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <div>
      {/* Header Container */}
      <div className="Settings-container">
        <div className="Settings-header">Name</div>
        <div className="Settings-header">Role</div>
      </div>

      {/* User Rows */}
      <div className="UserRow-container">
        {apiResponse.map((rowData, index) => (
          <div key={index} className="UserRow">
            <div className="UserRow-item">{rowData.name}</div>
            <select
              className="UserRow-item"
              value={rowData.role}
              onChange={(e) => handleRoleChange(rowData._id, e.target.value)}
            >
              <option value="admin">Admin</option>
              <option value="view_only">View Only</option>
              <option value="dispatcher">Dispatcher</option>
              <option value="operator">Operator</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;
