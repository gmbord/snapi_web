import React, { useEffect, useState } from "react";
import { get } from "../../utilities";

import "./QueueView.css";

const QueueView = () => {
  const [queue, setQueue] = useState(null);
  const [games, setGames] = useState([]);

  // useEffect hook to fetch queue data when the component mounts
  useEffect(() => {
    get("/api/queue")
      .then((data) => {
        setQueue(data);
        // If queue data is fetched successfully, fetch details of each game
        if (data && data.games) {
          Promise.all(
            data.games.map((gameId) => fetchGameDetails(removeTrailingQuestionMark(gameId)))
          )
            .then((gamesData) => {
              setGames(gamesData);
            })
            .catch((error) => {
              console.error("Error fetching game details:", error);
            });
        }
      })
      .catch((error) => {
        console.error("Error fetching queue data:", error);
      });
  }, []); // Empty dependency array ensures the effect runs only once on mount

  // Function to fetch game details
  const fetchGameDetails = async (gameId) => {
    try {
      const response = await get(`/api/game?id=${gameId}`);
      return response;
    } catch (error) {
      console.error(`Error fetching game details for gameId ${gameId}:`, error);
      return null;
    }
  };

  // Function to remove trailing question mark from gameId
  const removeTrailingQuestionMark = (gameId) => {
    if (gameId.endsWith("?")) {
      return gameId.slice(0, -1); // Remove the trailing question mark
    }
    return gameId;
  };

  // JSX to render the queue and games data
  return (
    <div>
      <h1>This is the Queue Page</h1>
      {queue ? (
        <div>
          <h2>Queue:</h2>
          {games.length > 0 ? (
            <div>
              {games.map((game, index) => (
                <div key={index}>
                  <h3>Game {index + 1}</h3>
                  {/* Render game details */}
                  {game ? (
                    <div>
                      <p>Player 1: {game.player1}</p>
                      <p>Player 2: {game.player2}</p>
                      {/* Add more game details as needed */}
                    </div>
                  ) : (
                    <p>Error fetching game details</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No games in the queue</p>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default QueueView;
