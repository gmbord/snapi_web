import React, { useEffect, useState } from "react";
import { get, post } from "../../utilities.js";

import "./ActiveGameView.css";

const ActiveGameView = (props) => {
  const [activeGames, setActiveGames] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedPlayer1, setSelectedPlayer1] = useState("");
  const [selectedPlayer2, setSelectedPlayer2] = useState("");
  const [selectedPlayer3, setSelectedPlayer3] = useState("");
  const [selectedPlayer4, setSelectedPlayer4] = useState("");
  const [changingPlayer, setChangingPlayer] = useState(null);
  const [needToSwitch, setNeedToSwitch] = useState(false);

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

  const handlePlayerChange = (position) => {
    setChangingPlayer(position);
  };

  const finishGame = async (activeGames) => {
    const game = activeGames[0];
    console.log(game);
    const team1Score = game.p1Stats[1] + game.p2Stats[1];
    const team2Score = game.p3Stats[1] + game.p4Stats[1];
    let needToSwitch = false;

    if (team1Score > team2Score) {
      needToSwitch = true;
    }

    let newGame = null;
    let q = null;

    try {
      const queueData = await get("/api/queue");
      console.log(queueData);
      newGame = queueData.games[0];
      q = queueData.games.slice(1);
    } catch (error) {
      console.error("Error fetching queue data:", error);
      return; // Exit the function if an error occurs
    }

    console.log(newGame);

    try {
      await post("/api/updateQueue", { games: q });
      await post("/api/removeGame", { id: newGame._id });
      console.log("Game removed from the database");
    } catch (error) {
      console.error("Error removing game from queue:", error);
      // Handle error
    }

    if (needToSwitch) {
      newGame.player3 = newGame.player1;
      newGame.player4 = newGame.player2;
      newGame.player1 = game.player1;
      newGame.player2 = game.player2;
    } else {
      newGame.player3 = game.player3;
      newGame.player4 = game.player4;
    }

    const requestBody = {
      id: game._id,
      status: "finished",
    };

    try {
      const updatedGame = await post("/api/updateGame", requestBody);
      console.log("Game updated:", updatedGame);
      window.location.reload();
    } catch (error) {
      console.error("Error updating game:", error);
      // Handle error
    }

    const requestBody2 = {
      id: newGame._id,
      status: "active",
    };

    try {
      const updatedGame2 = await post("/api/updateGame", requestBody2);
      console.log("Game updated:", updatedGame2);
      window.location.reload();
    } catch (error) {
      console.error("Error updating game:", error);
      // Handle error
    }

    setActiveGames([newGame]);
  };

  const handleConfirmChange = (position, selectedPlayer, game_id) => {
    // Implement logic to update player in the state or send to the server
    console.log(`Player at position ${position} changed to ${selectedPlayer}`);
    setChangingPlayer(null);

    const requestBody = {
      id: game_id, // Assuming gameId is accessible
    };

    switch (position) {
      case "player1":
        requestBody.player1 = selectedPlayer;
        break;
      case "player2":
        requestBody.player2 = selectedPlayer;
        break;
      case "player3":
        requestBody.player3 = selectedPlayer;
        break;
      case "player4":
        requestBody.player4 = selectedPlayer;
        break;
      default:
        console.error("Invalid player number");
        return; // Stop execution if playerNumber is invalid
    }

    post("/api/updateGame", requestBody)
      .then((updatedGame) => {
        console.log("Game updated:", updatedGame);
        // Reload the page after successful update
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error updating game:", error);
        // Handle error
      });
  };

  const playerDropdown = (position, selectedPlayer, setSelectedPlayer, game_id) => (
    <div>
      <select value={selectedPlayer} onChange={(e) => setSelectedPlayer(e.target.value)}>
        {users.map((user) => (
          <option key={user._id} value={user._id}>
            {user.name}
          </option>
        ))}
      </select>
      <button onClick={() => handleConfirmChange(position, selectedPlayer, game_id)}>
        Confirm
      </button>
    </div>
  );

  return (
    <div style={{ textAlign: "center" }}>
      {activeGames.map((game) => {
        const team1Score = game.p1Stats[1] + game.p2Stats[1];
        const team2Score = game.p3Stats[1] + game.p4Stats[1];
        const headerText = `Score: ${team1Score} :  ${team2Score}`;

        return (
          <React.Fragment key={game._id}>
            <ul style={{ listStyleType: "none", padding: 0 }}>
              <li style={{ position: "relative", display: "inline-block" }}>
                <p style={{ fontSize: "20px" }}>Second Head</p>
                <img src="/table.jpg" style={{ width: "250px", transform: "rotate(90deg)" }} />
                <p style={{ fontSize: "20px" }}>Dining</p>

                <p style={{ position: "absolute", top: 40, left: -40 }}>
                  {playerName(game.player1)}
                </p>
                <p style={{ position: "absolute", top: 40, right: 0 }}>
                  {playerName(game.player2)}
                </p>
                <p style={{ position: "absolute", bottom: 45, left: -40 }}>
                  {playerName(game.player3)}
                </p>
                <p style={{ position: "absolute", bottom: 45, right: 0 }}>
                  {playerName(game.player4)}
                </p>

                <p style={{ position: "absolute", top: 70, left: -10 }}>
                  {changingPlayer === "player1" ? (
                    playerDropdown("player1", selectedPlayer1, setSelectedPlayer1, game._id)
                  ) : (
                    <button onClick={() => handlePlayerChange("player1")}>Change</button>
                  )}
                </p>
                <p style={{ position: "absolute", top: 70, right: 0 }}>
                  {changingPlayer === "player2" ? (
                    playerDropdown("player2", selectedPlayer2, setSelectedPlayer2, game._id)
                  ) : (
                    <button onClick={() => handlePlayerChange("player2")}>Change</button>
                  )}
                </p>
                <p style={{ position: "absolute", bottom: 20, left: -10 }}>
                  {changingPlayer === "player3" ? (
                    playerDropdown("player3", selectedPlayer3, setSelectedPlayer3, game._id)
                  ) : (
                    <button onClick={() => handlePlayerChange("player3")}>Change</button>
                  )}
                </p>
                <p style={{ position: "absolute", bottom: 20, right: -10 }}>
                  {changingPlayer === "player4" ? (
                    playerDropdown("player4", selectedPlayer4, setSelectedPlayer4, game._id)
                  ) : (
                    <button onClick={() => handlePlayerChange("player4")}>Change</button>
                  )}
                </p>

                <p style={{ position: "absolute", bottom: -50, right: 50 }}>
                  <button onClick={() => finishGame(activeGames)}>Finish Game</button>
                </p>

                <p style={{ position: "absolute", top: 0, left: -500 }}>{"Tosses"}</p>
                <p style={{ position: "absolute", top: 0, left: -400 }}>{"Points"}</p>
                <p style={{ position: "absolute", top: 0, left: -300 }}>{"Catches"}</p>
                <p style={{ position: "absolute", top: 0, left: -200 }}>{"Drops"}</p>

                <p style={{ position: "absolute", top: 0, right: -490 }}>{"Drops"}</p>
                <p style={{ position: "absolute", top: 0, right: -400 }}>{"Catches"}</p>
                <p style={{ position: "absolute", top: 0, right: -300 }}>{"Points"}</p>
                <p style={{ position: "absolute", top: 0, right: -200 }}>{"Tosses"}</p>

                <p style={{ position: "absolute", top: 60, left: -475 }}>{game.p1Stats[0]}</p>
                <p style={{ position: "absolute", top: 60, left: -375 }}>{game.p1Stats[1]}</p>
                <p style={{ position: "absolute", top: 60, left: -275 }}>{game.p1Stats[2]}</p>
                <p style={{ position: "absolute", top: 60, left: -175 }}>{game.p1Stats[3]}</p>

                <p style={{ position: "absolute", top: 60, right: -475 }}>{game.p2Stats[3]}</p>
                <p style={{ position: "absolute", top: 60, right: -375 }}>{game.p2Stats[2]}</p>
                <p style={{ position: "absolute", top: 60, right: -275 }}>{game.p2Stats[1]}</p>
                <p style={{ position: "absolute", top: 60, right: -175 }}>{game.p2Stats[0]}</p>

                <p style={{ position: "absolute", bottom: 50, left: -475 }}>{game.p3Stats[0]}</p>
                <p style={{ position: "absolute", bottom: 50, left: -375 }}>{game.p3Stats[1]}</p>
                <p style={{ position: "absolute", bottom: 50, left: -275 }}>{game.p3Stats[2]}</p>
                <p style={{ position: "absolute", bottom: 50, left: -175 }}>{game.p3Stats[3]}</p>

                <p style={{ position: "absolute", bottom: 50, right: -475 }}>{game.p4Stats[3]}</p>
                <p style={{ position: "absolute", bottom: 50, right: -375 }}>{game.p4Stats[2]}</p>
                <p style={{ position: "absolute", bottom: 50, right: -275 }}>{game.p4Stats[1]}</p>
                <p style={{ position: "absolute", bottom: 50, right: -175 }}>{game.p4Stats[0]}</p>
              </li>
            </ul>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ActiveGameView;
