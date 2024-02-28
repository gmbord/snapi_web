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

  const handleConfirmChange = (position, selectedPlayer) => {
    // Implement logic to update player in the state or send to the server
    console.log(`Player at position ${position} changed to ${selectedPlayer}`);
    setChangingPlayer(null);

  };

  const playerDropdown = (position, selectedPlayer, setSelectedPlayer) => (
    <div>
      <select
        value={selectedPlayer}
        onChange={(e) => setSelectedPlayer(e.target.value)}
      >
        {users.map((user) => (
          <option key={user._id} value={user._id}>
            {user.name}
          </option>
        ))}
      </select>
      <button onClick={() => handleConfirmChange(position, selectedPlayer)}>
        Confirm
      </button>
    </div>
  );

  return (
    <div style={{ textAlign: 'center' }}>
      {activeGames.map((game) => {
        const team1Score = game.p1Stats[1] + game.p2Stats[1];
        const team2Score = game.p3Stats[1] + game.p4Stats[1];
        const headerText = `Score: ${team1Score} :  ${team2Score}`;

        return (
          <React.Fragment key={game._id}>
            <h1>{headerText}</h1>
            <ul style={{ listStyleType: "none", padding: 0 }}>
              <li style={{ position: 'relative', display: 'inline-block' }}>
                <a href="/">
                  <img src="/table.jpg" style={{ width: '250px' }} />
                </a>

                <p style={{ position: 'absolute', top: 80, left: -100 }}>{playerName(game.player1)}</p>
                <p style={{ position: 'absolute', bottom: 80, left: -100 }}>{playerName(game.player2)}</p>
                <p style={{ position: 'absolute', top: 80, right: -35 }}>{playerName(game.player3)}</p>
                <p style={{ position: 'absolute', bottom: 80, right: -35 }}>{playerName(game.player4)}</p>

                <p style={{ position: 'absolute', top: 60, left: -100 }}>
                  {changingPlayer === "player1" ? (
                    playerDropdown("player1", selectedPlayer1, setSelectedPlayer1)
                  ) : (
                    <button onClick={() => handlePlayerChange("player1")}>
                      Change
                    </button>
                  )}
                </p>
                <p style={{ position: 'absolute', bottom: 60, left: -100 }}>
                  {changingPlayer === "player2" ? (
                    playerDropdown("player2", selectedPlayer2, setSelectedPlayer2)
                  ) : (
                    <button onClick={() => handlePlayerChange("player2")}>
                      Change
                    </button>
                  )}
                </p>
                <p style={{ position: 'absolute', top: 60, right: -100 }}>
                  {changingPlayer === "player3" ? (
                    playerDropdown("player3", selectedPlayer3, setSelectedPlayer3)
                  ) : (
                    <button onClick={() => handlePlayerChange("player3")}>
                      Change
                    </button>
                  )}
                </p>
                <p style={{ position: 'absolute', bottom: 60, right: -100 }}>
                  {changingPlayer === "player4" ? (
                    playerDropdown("player4", selectedPlayer4, setSelectedPlayer4)
                  ) : (
                    <button onClick={() => handlePlayerChange("player4")}>
                      Change
                    </button>
                  )}
                </p>

                <p style={{ position: 'absolute', top: 0, left: -500}}>{"Tosses"}</p>
                <p style={{ position: 'absolute', top: 0, left: -400}}>{"Points"}</p>
                <p style={{ position: 'absolute', top: 0, left: -300}}>{"Catches"}</p>
                <p style={{ position: 'absolute', top: 0, left: -200}}>{"Drops"}</p>

                <p style={{ position: 'absolute', top: 0, right: -490}}>{"Drops"}</p>
                <p style={{ position: 'absolute', top: 0, right: -400}}>{"Catches"}</p>
                <p style={{ position: 'absolute', top: 0, right: -300}}>{"Points"}</p>
                <p style={{ position: 'absolute', top: 0, right: -200}}>{"Tosses"}</p>

                <p style={{ position: 'absolute', top: 60, left: -475}}>{game.p1Stats[0]}</p>
                <p style={{ position: 'absolute', top: 60, left: -375}}>{game.p1Stats[1]}</p>
                <p style={{ position: 'absolute', top: 60, left: -275}}>{game.p1Stats[2]}</p>
                <p style={{ position: 'absolute', top: 60, left: -175}}>{game.p1Stats[3]}</p>

                <p style={{ position: 'absolute', bottom: 50, left: -475}}>{game.p2Stats[0]}</p>
                <p style={{ position: 'absolute', bottom: 50, left: -375}}>{game.p2Stats[1]}</p>
                <p style={{ position: 'absolute', bottom: 50, left: -275}}>{game.p2Stats[2]}</p>
                <p style={{ position: 'absolute', bottom: 50, left: -175}}>{game.p2Stats[3]}</p>

                <p style={{ position: 'absolute', top: 60, right: -475}}>{game.p3Stats[3]}</p>
                <p style={{ position: 'absolute', top: 60, right: -375}}>{game.p3Stats[2]}</p>
                <p style={{ position: 'absolute', top: 60, right: -275}}>{game.p3Stats[1]}</p>
                <p style={{ position: 'absolute', top: 60, right: -175}}>{game.p3Stats[0]}</p>

                <p style={{ position: 'absolute', bottom: 50, right: -475}}>{game.p4Stats[3]}</p>
                <p style={{ position: 'absolute', bottom: 50, right: -375}}>{game.p4Stats[2]}</p>
                <p style={{ position: 'absolute', bottom: 50, right: -275}}>{game.p4Stats[1]}</p>
                <p style={{ position: 'absolute', bottom: 50, right: -175}}>{game.p4Stats[0]}</p>
              </li>
            </ul>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ActiveGameView;
