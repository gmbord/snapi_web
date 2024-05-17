/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

const express = require("express");

// import models so we can interact with the database
const User = require("./models/user");
const Game = require("./models/game");
const Queue = require("./models/queue");
const Leaderboard = require("./models/leaderboard");

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socketManager = require("./server-socket");

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }

  res.send(req.user);
});

router.post("/initsocket", (req, res) => {
  console.log(req.body);
  // do nothing if user not logged in
  if (req.user)
    socketManager.addUser(req.user, socketManager.getSocketFromSocketID(req.body.socketid));
  res.send({});
});

// |------------------------------|
// | write your API methods below!|
// |------------------------------|
router.get("/games", auth.ensureLoggedIn, (req, res) => {
  Game.find().then((games) => {
    res.send(games);
  });
});

router.get("/game", auth.ensureLoggedIn, (req, res) => {
  console.log("HIIII IM HERE $$$$$");
  let gameId = req.query.id; // Access query parameter 'id'
  if (gameId.endsWith("?")) {
    gameId = gameId.slice(0, -1); // Remove the trailing question mark
  }
  Game.findById(gameId)
    .then((game) => {
      if (!game) {
        res.status(404).send({ msg: "Game not found" });
      } else {
        res.send(game);
      }
    })
    .catch((error) => {
      console.error("Error fetching game:", error);
      res.status(500).send("Error fetching game");
    });
});

// Route to remove a game by its ID
router.post("/removeGame", async (req, res) => {
  const { id } = req.body;
  try {
    // Find the game by its ID and delete it
    await Game.findByIdAndDelete(id);
    res.status(200).json({ message: "Game removed successfully" });
  } catch (error) {
    console.error("Error removing game:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/activeGames", (req, res) => {
  Game.find({ status: "active" })
    .then((game) => {
      if (!game) {
        res.status(404).send({ msg: "Game not found" });
      } else {
        res.send(game);
      }
    })
    .catch((error) => {
      console.error("Error fetching game:", error);
      res.status(500).send("Error fetching game");
    });
});

router.get("/finishedGames", (req, res) => {
  Game.find({ status: "finished" })
    .then((games) => {
      if (!games) {
        res.status(404).send({ msg: "Game not found" });
      } else {
        res.send(games);
      }
    })
    .catch((error) => {
      console.error("Error fetching game:", error);
      res.status(500).send("Error fetching game");
    });
});

router.get("/playerGames", auth.ensureLoggedIn, (req, res) => {
  const userId = req.user._id;
  Game.find({
    $or: [{ player1: userId }, { player2: userId }, { player3: userId }, { player4: userId }],
  })
    .then((games) => {
      res.send(games);
    })
    .catch((err) => {
      console.error("Error fetching player games:", err);
      res.status(500).send("Error fetching player games");
    });
});

router.get("/users", auth.ensureLoggedIn, (req, res) => {
  console.log(req);
  User.find().then((users) => {
    res.send(users);
  });
});

router.get("/user", auth.ensureLoggedIn, (req, res) => {
  if (!req.query.id || req.query.id == "null") {
    res.send({});
  } else {
    let userId = req.query.id;
    if (userId.endsWith("?")) {
      userId = userId.slice(0, -1); // Remove the trailing question mark
    }
    console.log("userId");
    console.log(userId);
    User.findById(userId).then((user) => {
      if (!user) {
        res.send({});
      } else {
        res.send(user);
      }
    });
  }
});

router.get("/queue", async (req, res) => {
  try {
    const queueId = "65d90471fb4f1be701069c76"; // Access query parameter 'id'
    const queue = await Queue.findById(queueId);
    if (!queue) {
      res.status(404).send({ msg: "Queue not found" });
    } else {
      res.send(queue);
    }
  } catch (error) {
    console.error("Error fetching queue:", error);
    res.status(500).send("Error fetching queue");
  }
});

router.post("/game", auth.ensureLoggedIn, (req, res) => {
  const newGame = new Game({
    winner: 0,
    status: 0,
  });
  if ("player1" in req.body) {
    newGame.player1 = req.body.player1;
  }
  if ("player2" in req.body) {
    newGame.player2 = req.body.player2;
  }
  if ("player3" in req.body) {
    newGame.player3 = req.body.player3;
  }
  if ("player4" in req.body) {
    newGame.player4 = req.body.player4;
  }
  if ("p1Stats" in req.body) {
    newGame.p1Stats = req.body.p1Stats;
  }
  if ("p2Stats" in req.body) {
    newGame.p2Stats = req.body.p2Stats;
  }
  if ("p3Stats" in req.body) {
    newGame.p3Stats = req.body.p3Stats;
  }
  if ("p4Stats" in req.body) {
    newGame.p4Stats = req.body.p4Stats;
  }
  if ("winner" in req.body) {
    newGame.winner = req.body.winner;
  }
  if ("time" in req.body) {
    newGame.time = req.body.time;
  }
  if ("status" in req.body) {
    newGame.status = req.body.status;
  }

  newGame.save().then((game) => res.send(game));
});

router.post("/updateGame", auth.ensureLoggedIn, (req, res) => {
  Game.findById(req.body.id).then((game) => {
    if (!game) {
      res.send({});
    } else {
      if ("player1" in req.body) {
        game.player1 = req.body.player1;
      }
      if ("player2" in req.body) {
        game.player2 = req.body.player2;
      }
      if ("player3" in req.body) {
        game.player3 = req.body.player3;
      }
      if ("player4" in req.body) {
        game.player4 = req.body.player4;
      }
      if ("p1Stats" in req.body) {
        game.p1Stats = req.body.p1Stats;
      }
      if ("p2Stats" in req.body) {
        game.p2Stats = req.body.p2Stats;
      }
      if ("p3Stats" in req.body) {
        game.p3Stats = req.body.p3Stats;
      }
      if ("p4Stats" in req.body) {
        game.p4Stats = req.body.p4Stats;
      }
      if ("winner" in req.body) {
        game.winner = req.body.winner;
      }
      if ("time" in req.body) {
        game.time = req.body.time;
      }
      if ("status" in req.body) {
        game.status = req.body.status;
      }
      game.save().then((game) => res.send(game));
    }
  });
});

router.post("/updateGameExternal", (req, res) => {
  console.log("&&&&&&&&&&");
  console.log(req.body);
  Game.findOne({ status: "active" })
    .then((game) => {
      if (!game) {
        res.send({});
      } else {
        if ("player1" in req.body) {
          game.player1 = req.body.player1;
        }
        if ("player2" in req.body) {
          game.player2 = req.body.player2;
        }
        if ("player3" in req.body) {
          game.player3 = req.body.player3;
        }
        if ("player4" in req.body) {
          game.player4 = req.body.player4;
        }
        if ("p1Stats" in req.body) {
          game.p1Stats = req.body.p1Stats;
        }
        if ("p2Stats" in req.body) {
          game.p2Stats = req.body.p2Stats;
        }
        if ("p3Stats" in req.body) {
          game.p3Stats = req.body.p3Stats;
        }
        if ("p4Stats" in req.body) {
          game.p4Stats = req.body.p4Stats;
        }
        if ("winner" in req.body) {
          game.winner = req.body.winner;
        }
        if ("time" in req.body) {
          game.time = req.body.time;
        }
        if ("status" in req.body) {
          game.status = req.body.status;
        }
        game.save().then((game) => res.send(game));
      }
    })
    .catch((error) => {
      console.error("Error updating game:", error);
      res.status(500).send("Internal Server Error");
    });
});

router.post("/updateUser", auth.ensureLoggedIn, (req, res) => {
  console.log(req.body);
  User.findById(req.body.id).then((user) => {
    if (!user) {
      res.send({});
    } else {
      if ("role" in req.body) {
        user.role = req.body.role;
      }
      if ("name" in req.body) {
        user.name = req.body.name;
      }
      user.save().then((user) => res.send(user));
    }
  });
});

router.post("/updateQueue", auth.ensureLoggedIn, (req, res) => {
  Queue.findById(req.body.id).then((queue) => {
    if (!queue) {
      res.send({});
    } else {
      if ("games" in req.body) {
        queue.games = req.body.games;
      }
      queue.save().then((queue) => res.send(queue));
    }
  });
});

router.get("/leaderboard", async (req, res) => {
  try {
    const queueId = "6647aec433b306f4faf34c29"; // Access query parameter 'id'
    if (!queueId) {
      return res.status(400).send({ msg: "Queue ID is required" });
    }
    const queue = await Leaderboard.findById(queueId);
    if (!queue) {
      return res.status(404).send({ msg: "Leaderboard not found" });
    }
    res.send(queue);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).send("Error fetching leaderboard");
  }
});

const aggregateStats = (games) => {
  const userStats = {};

  games.forEach((game) => {
    const players = [game.player1, game.player2, game.player3, game.player4].filter(
      (player) => player
    ); // Filter out null players
    const stats = [game.p1Stats, game.p2Stats, game.p3Stats, game.p4Stats].filter(
      (_, index) => game[`player${index + 1}`]
    ); // Filter out corresponding null stats
    const winner = game.winner;

    players.forEach((playerId, index) => {
      if (!userStats[playerId]) {
        userStats[playerId] = {
          tosses: 0,
          points: 0,
          catches: 0,
          drops: 0,
          wins: 0,
          gamesPlayed: 0,
        };
      }

      // Replace NaN and Infinity values with 0
      const tosses = Number.isFinite(stats[index][0]) ? stats[index][0] : 0;
      const points = Number.isFinite(stats[index][1]) ? stats[index][1] : 0;
      const catches = Number.isFinite(stats[index][2]) ? stats[index][2] : 0;
      const drops = Number.isFinite(stats[index][3]) ? stats[index][3] : 0;

      userStats[playerId].tosses += tosses;
      userStats[playerId].points += points;
      userStats[playerId].catches += catches;
      userStats[playerId].drops += drops;
      userStats[playerId].gamesPlayed += 1;

      if ((winner === 1 && index < 2) || (winner === 2 && index >= 2)) {
        userStats[playerId].wins += 1;
      }
    });
  });

  return userStats;
};

// Route to update the leaderboard
router.post("/updateLeaderboard", async (req, res) => {
  const leaderboardId = "6647aec433b306f4faf34c29"; // Specified _id of the leaderboard document

  try {
    const games = await Game.find({ status: "finished" });

    const userStats = aggregateStats(games);

    const leaderboardEntries = {
      games_played: [],
      total_wins: [],
      total_tosses: [],
      total_points: [],
      total_catches: [],
      total_drops: [],
      points_per_toss: [],
      catches_per_drop: [],
    };

    const NULL_USER_ID = "65d8cec0218fb4ecca079baf";

    // Inside the loop where you construct leaderboardEntries
    Object.keys(userStats).forEach((userId) => {
      const stats = userStats[userId];
      const processedUserId = userId || NULL_USER_ID; // Replace null user ID with specified user ID

      leaderboardEntries.games_played.push({ user: processedUserId, stat: stats.gamesPlayed });
      leaderboardEntries.total_wins.push({ user: processedUserId, stat: stats.wins });
      leaderboardEntries.total_tosses.push({ user: processedUserId, stat: stats.tosses });
      leaderboardEntries.total_points.push({ user: processedUserId, stat: stats.points });
      leaderboardEntries.total_catches.push({ user: processedUserId, stat: stats.catches });
      leaderboardEntries.total_drops.push({ user: processedUserId, stat: stats.drops });

      // Calculate points per toss, ensuring not to divide by zero
      const pointsPerToss = stats.tosses !== 0 ? stats.points / stats.tosses : 0;
      leaderboardEntries.points_per_toss.push({ user: processedUserId, stat: pointsPerToss });

      // Calculate catches per drop, ensuring not to divide by zero
      const catchesPerDrop = stats.drops !== 0 ? stats.catches / stats.drops : 0;
      leaderboardEntries.catches_per_drop.push({ user: processedUserId, stat: catchesPerDrop });
    });

    // Sort and limit to top 5
    Object.keys(leaderboardEntries).forEach((key) => {
      leaderboardEntries[key].sort((a, b) => b.stat - a.stat).splice(5);
    });

    // Update the existing leaderboard document with the specified _id
    await Leaderboard.findByIdAndUpdate(leaderboardId, leaderboardEntries, { new: true });

    res.status(200).json({ message: "Leaderboard updated successfully" });
  } catch (error) {
    console.error("Error updating leaderboard:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
