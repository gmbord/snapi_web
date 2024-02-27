import React, { useEffect, useState } from "react";
import { get } from "../../utilities.js";

import "./ActiveGameView.css";

const ActiveGameView = (props) => {
  const [activeGames, setActiveGames] = useState([]);

  useEffect(() => {
    // Fetch active games data when component mounts
    get("/api/activeGames")
      .then((games) => {
        setActiveGames(games);
      })
      .catch((error) => {
        console.error("Error fetching active games:", error);
      });
  }, []); // Empty dependency array to run effect only once on mount

  return (
    <div>
      <h1>This is the Active Game Page</h1>
      <ul>
        {activeGames.map((game) => (
          <li key={game._id}>
            Player 1: {game.player1} {/* Assuming player1 is the name */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActiveGameView;
