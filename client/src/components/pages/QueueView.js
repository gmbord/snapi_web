import React, { useEffect, useState } from "react";
import { get, post } from "../../utilities";

import "./QueueView.css";

const QueueView = () => {
  const [queue, setQueue] = useState(null);
  const [games, setGames] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedPlayer1, setSelectedPlayer1] = useState("");
  const [selectedPlayer2, setSelectedPlayer2] = useState("");

  // useEffect hook to fetch queue data and users when the component mounts
  useEffect(() => {
    get("/api/queue")
      .then((data) => {
        setQueue(data);
        setGames(data?.games || []);
      })
      .catch((error) => {
        console.error("Error fetching queue data:", error);
      });

    get("/api/users")
      .then((data) => {
        setUsers(data);
        setSelectedPlayer1(data[0]._id); // Set the default selected player to the first user
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []); // Empty dependency array ensures the effect runs only once on mount

  // Function to handle adding a new game to the queue
  const handleAddToQueue = () => {
    if (selectedPlayer1 && selectedPlayer2) {
      post("/api/game", { player1: selectedPlayer1, player2: selectedPlayer2 })
        .then((newGame) => {
          const updatedQueue = { ...queue };
          updatedQueue.games.push(newGame._id);
          return post("/api/updateQueue", { id: queue._id, games: updatedQueue.games });
        })
        .then((updatedQueue) => {
          setQueue(updatedQueue);
          setGames(updatedQueue.games);
        })
        .catch((error) => {
          console.error("Error adding game to queue:", error);
        });
    }
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
              {games.map((gameId, index) => (
                <div key={index}>
                  <h3>Game {index + 1}</h3>
                  <p>{"Player 1:  " + games[index].player1}</p>
                  <p>{"Player 2:  " + games[index].player2}</p>
                  {/* Render game details */}
                </div>
              ))}
            </div>
          ) : (
            <p>No games in the queue</p>
          )}
          {/* Form to add a new game to the queue */}
          <div>
            <h2>Add Game To Queue:</h2>
            <select value={selectedPlayer1} onChange={(e) => setSelectedPlayer1(e.target.value)}>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
            <select value={selectedPlayer2} onChange={(e) => setSelectedPlayer2(e.target.value)}>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
            <button onClick={handleAddToQueue}>Add to Queue</button>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default QueueView;
