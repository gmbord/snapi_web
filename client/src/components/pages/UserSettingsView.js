import React, { useEffect, useState } from "react";
import { get, post } from "../../utilities.js";
import "./UserSettingsView.css";

const UserSettingsView = (props) => {
  const [name, setName] = useState("");
  const [newName, setNewName] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const fetchUserName = async () => {
    try {
      const response = await get("/api/getUserName");
      setName(response.name);
    } catch (error) {
      console.error("Error fetching user name:", error);
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setNewName(name);
  };

  const handleSaveClick = async () => {
    try {
      await post("/api/updateUserName", { name: newName });
      setName(newName);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user name:", error);
    }
  };

  useEffect(() => {
    fetchUserName();
  }, []);

  return (
    <div>
      <h1>User Settings Page</h1>
      {isEditing ? (
        <div>
          <input type="text" value={newName} onChange={handleNameChange} />
          <button onClick={handleSaveClick}>Confirm Change</button>
        </div>
      ) : (
        <div>
          <p>Name: {name}</p>
          <button onClick={handleEditClick}>Update Name</button>
        </div>
      )}
    </div>
  );
};

export default UserSettingsView;
