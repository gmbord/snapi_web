import React, { useEffect, useState } from "react";
import { get, post } from "../../utilities.js";
import "./StatsView.css";

const StatsView = (props) => {
  const [leaderboard, setLeaderboard] = useState({});
  const [users, setUsers] = useState([]);

  const fetchLeaderboard = async () => {
    try {
      const response = await get("/api/leaderboard");
      setLeaderboard(response);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await get("/api/users");
      setUsers(response);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    fetchUsers();
  }, []);

  const getPlayerName = (userId) => {
    const user = users.find((user) => user._id === userId);
    return user ? user.name : "Unknown";
  };

  const handleUpdateLeaderboard = async () => {
    try {
      await post("/api/updateLeaderboard");
      fetchLeaderboard(); // Refresh leaderboard after update
    } catch (error) {
      console.error("Error updating leaderboard:", error);
    }
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div>
      <h1>This is the Stats Page</h1>
      <button onClick={handleUpdateLeaderboard}>Update Leaderboard</button>
      {Object.entries(leaderboard).map(([category, stats]) => {
        // Exclude _id category
        if (category === "_id") return null;

        // Replace underscores with spaces and capitalize first letter of each word
        const categoryName = category.split("_").map(capitalizeFirstLetter).join(" ");

        return (
          <div key={category}>
            <h2>{categoryName}</h2>
            {Array.isArray(stats) ? (
              <table>
                <thead>
                  <tr>
                    <th>Player</th>
                    <th>Stat</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.map(({ user, stat }) => (
                    <tr key={user}>
                      <td>{getPlayerName(user)}</td>
                      <td>{stat}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No stats available for this category.</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StatsView;
