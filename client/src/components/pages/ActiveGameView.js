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

  useEffect(() => {
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
  }, []);

  const playerName = (id) => {
    const user = users.find((user) => user._id === id);
    return user ? user.name : null;
  };

  const handlePlayerChange = (position) => {
    setChangingPlayer(position);
  };

  const handleConfirmChange = (position, selectedPlayer, game_id) => {
    setChangingPlayer(null);
    const requestBody = { id: game_id };

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
        console.error("Invalid player position");
        return;
    }

    post("/api/updateGame", requestBody)
      .then((updatedGame) => {
        console.log("Game updated:", updatedGame);
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error updating game:", error);
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

  const finishGame = async (activeGames) => {
    const game = activeGames[0];
    const team1Score = game.p1Stats[1] + game.p2Stats[1];
    const team2Score = game.p3Stats[1] + game.p4Stats[1];
    let needToSwitch = team1Score > team2Score;

    game.winner = needToSwitch ? 1 : 2;

    let queueData = null;
    try {
      queueData = await get("/api/queue");
    } catch (error) {
      console.error("Error fetching queue data:", error);
      return;
    }

    let newGameId = null;
    let newGame = null;

    if (queueData.games.length === 0) {
      const requestBody = {
        status: "active",
        p1Stats: [0, 0, 0, 0],
        p2Stats: [0, 0, 0, 0],
        p3Stats: [0, 0, 0, 0],
        p4Stats: [0, 0, 0, 0],
      };
      try {
        newGame = await post("/api/game", requestBody);
      } catch (error) {
        console.error("Error creating new game:", error);
        return;
      }
    } else {
      newGameId = queueData.games[0];
      const q = queueData.games.slice(1);

      try {
        newGame = await get(`/api/game?id=${newGameId}`);
      } catch (error) {
        console.error("Error fetching new game:", error);
        return;
      }

      try {
        await post("/api/updateQueue", { id: "65d90471fb4f1be701069c76", games: q });
      } catch (error) {
        console.error("Error updating queue:", error);
        return;
      }

      const p1Id = needToSwitch ? game.player1 : newGame.player1;
      const p2Id = needToSwitch ? game.player2 : newGame.player2;
      const p3Id = needToSwitch ? newGame.player1 : game.player3;
      const p4Id = needToSwitch ? newGame.player2 : game.player4;

      const requestBody2 = {
        id: newGameId,
        status: "active",
        player1: p1Id,
        player2: p2Id,
        player3: p3Id,
        player4: p4Id,
        p1Stats: [0, 0, 0, 0],
        p2Stats: [0, 0, 0, 0],
        p3Stats: [0, 0, 0, 0],
        p4Stats: [0, 0, 0, 0],
      };

      try {
        await post("/api/updateGame", requestBody2);
      } catch (error) {
        console.error("Error updating new game:", error);
        return;
      }
    }

    const requestBody = {
      id: game._id,
      status: "finished",
      winner: game.winner,
    };

    try {
      await post("/api/updateGame", requestBody);
    } catch (error) {
      console.error("Error updating finished game:", error);
      return;
    }

    setActiveGames([newGame]);
    window.location.reload();
  };

  return (
    <div className="active-game-view">
      {activeGames.map((game) => {
        const team1Score = game.p1Stats[1] + game.p2Stats[1];
        const team2Score = game.p3Stats[1] + game.p4Stats[1];

        return (
          <div key={game._id} className="game-container">
            <h2>Active Game</h2>
            <div className="scoreboard">
              <div className="team">
                <h3>Team 1</h3>
                <p>
                  {playerName(game.player1)} & {playerName(game.player2)}
                </p>
                <p>Score: {team1Score}</p>
                <p>
                  Tosses: {game.p1Stats[0]} - {game.p2Stats[0]}
                </p>
                <p>
                  Points: {game.p1Stats[1]} - {game.p2Stats[1]}
                </p>
                <p>
                  Catches: {game.p1Stats[2]} - {game.p2Stats[2]}
                </p>
                <p>
                  Drops: {game.p1Stats[3]} - {game.p2Stats[3]}
                </p>
                {changingPlayer === "player1" ? (
                  playerDropdown("player1", selectedPlayer1, setSelectedPlayer1, game._id)
                ) : (
                  <button onClick={() => handlePlayerChange("player1")}>Change Player 1</button>
                )}
                {changingPlayer === "player2" ? (
                  playerDropdown("player2", selectedPlayer2, setSelectedPlayer2, game._id)
                ) : (
                  <button onClick={() => handlePlayerChange("player2")}>Change Player 2</button>
                )}
              </div>
              <div className="team">
                <h3>Team 2</h3>
                <p>
                  {playerName(game.player3)} & {playerName(game.player4)}
                </p>
                <p>Score: {team2Score}</p>
                <p>
                  Tosses: {game.p3Stats[0]} - {game.p4Stats[0]}
                </p>
                <p>
                  Points: {game.p3Stats[1]} - {game.p4Stats[1]}
                </p>
                <p>
                  Catches: {game.p3Stats[2]} - {game.p4Stats[2]}
                </p>
                <p>
                  Drops: {game.p3Stats[3]} - {game.p4Stats[3]}
                </p>
                {changingPlayer === "player3" ? (
                  playerDropdown("player3", selectedPlayer3, setSelectedPlayer3, game._id)
                ) : (
                  <button onClick={() => handlePlayerChange("player3")}>Change Player 3</button>
                )}
                {changingPlayer === "player4" ? (
                  playerDropdown("player4", selectedPlayer4, setSelectedPlayer4, game._id)
                ) : (
                  <button onClick={() => handlePlayerChange("player4")}>Change Player 4</button>
                )}
              </div>
            </div>
            <button onClick={() => finishGame(activeGames)} className="finish-game-btn">
              Finish Game
            </button>
          </div>
        );
      })}
      <div>
        <a href="/">
          <img src="/table.jpg" style={{ width: "200px", height: "400px" }} />
        </a>
      </div>
    </div>
  );
};

export default ActiveGameView;
