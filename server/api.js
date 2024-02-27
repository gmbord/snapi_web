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

router.get("/activeGames", auth.ensureLoggedIn, (req, res) => {
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
      game.save().then((game) => res.send(game));
    }
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

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
