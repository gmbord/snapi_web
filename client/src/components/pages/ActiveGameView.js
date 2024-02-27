import React, { useEffect, useState } from "react";
import { get } from "../../utilities.js";

import "./ActiveGameView.css";

const ActiveGameView = (props) => {
  const [activeGames, setActiveGames] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch active games data when component mounts
    get("/api/activeGames")
      .then((games) => {
        setActiveGames(games);
      })
      .catch((error) => {
        console.error("Error fetching active games:", error);
      });

    get("/api/users")
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []); // Empty dependency array to run effect only once on mount

  const playerName = (id) => {
    const user = users.find((user) => user._id === id);
    return user ? user.name : null;
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>This is the Active Game Page</h1>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {activeGames.map((game) => (
          <li key={game._id} style={{ position: 'relative', display: 'inline-block' }}>
            <a href="/">
              <img src="/table.jpg" style={{ width: '250px' }} />
            </a>
            <p style={{ position: 'absolute', top: 60, left: -100 }}>{playerName(game.player1)}</p>
            <p style={{ position: 'absolute', top: 60, right: -35 }}>{playerName(game.player3)}</p>
            <p style={{ position: 'absolute', bottom: 50, left: -100 }}>{playerName(game.player2)}</p>
            <p style={{ position: 'absolute', bottom: 50, right: -35 }}>{playerName(game.player4)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActiveGameView;
