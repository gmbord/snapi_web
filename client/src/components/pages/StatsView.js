import React, { useEffect, useState } from "react";
import { get, post } from "../../utilities.js";
import "./StatsView.css";

const StatsView = (props) => {
  const [leaderboard, setLeaderboard] = useState({});
  const [users, setUsers] = useState([]);
  const [userStats, setUserStats] = useState(null);

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

  const fetchUserStats = async () => {
    try {
      const response = await get("/api/getUserStats");
      setUserStats(response);
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    fetchUsers();
    fetchUserStats();
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
      <h1>Leader Board</h1>
      <button onClick={handleUpdateLeaderboard}>Update Leaderboard</button>
      <div className="stats-grid">
        {userStats && (
          <div className="stats-box">
            <h2>Your Stats</h2>
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(userStats).map(([category, value]) => (
                  <tr key={category}>
                    <td>{capitalizeFirstLetter(category)}</td>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {Object.entries(leaderboard).map(([category, stats]) => {
          if (category === "_id") return null;

          const categoryName = category.split("_").map(capitalizeFirstLetter).join(" ");

          return (
            <div className="stats-box" key={category}>
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
    </div>
  );
};

export default StatsView;
