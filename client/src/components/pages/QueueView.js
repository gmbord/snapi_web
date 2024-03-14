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
        for (const qi of data.games) {
          getGame(qi);
        }
      })
      .catch((error) => {
        console.error("Error fetching queue data:", error);
      });

    get("/api/users")
      .then((data) => {
        setUsers(data);
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
          return Promise.all([
            newGame,
            post("/api/updateQueue", { id: queue._id, games: updatedQueue.games }),
          ]);
        })
        .then(([newGame, updatedQueue]) => {
          setQueue(updatedQueue);
          // Fetch the newly added game and add it to the games state
          getGame(newGame._id);
        })
        .catch((error) => {
          console.error("Error adding game to queue:", error);
        });
    }
  };

  // Function to remove a game from the queue
  const handleRemoveFromQueue = (gameId) => {
    const updatedGames = games.filter((game) => game._id !== gameId);
    const updatedQueue = { ...queue, games: updatedGames.map((game) => game._id) };

    post("/api/updateQueue", { id: queue._id, games: updatedQueue.games })
      .then((updatedQueue) => {
        setQueue(updatedQueue);
        setGames(updatedGames);
        // After successfully updating the queue, remove the game from the database
        return post("/api/removeGame", { id: gameId });
      })
      .then(() => {
        console.log("Game removed from the database");
      })
      .catch((error) => {
        console.error("Error removing game from queue:", error);
      });
  };

  const getGame = (id) => {
    fetch(`/api/game?id=${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((game) => {
        setGames((prevGames) => [...prevGames, game]); // Add the new game to the games state
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  const playerName = (id) => {
    const user = users.find((user) => user._id === id);
    return user ? user.name : null;
  };
  console.log("GAMES");
  console.log(games);

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
                  <div>
                    {/* Container for Game number and Remove button */}
                    <div style={{ display: "inline-block", marginRight: "10px" }}>
                      <h3>Game {index + 1}</h3>
                    </div>
                    <div style={{ display: "inline-block", marginRight: "10px" }}>
                      <button onClick={() => handleRemoveFromQueue(game._id)}>Remove</button>
                    </div>
                  </div>
                  {/* Container for player names */}
                  <div>
                    <p>{"Player 1:  " + playerName(game.player1)}</p>
                    <p>{"Player 2:  " + playerName(game.player2)}</p>
                  </div>
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
