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

// router.get("/robots", auth.ensureLoggedIn, (req, res) => {
//   Robot.find({ company: req.user.company }).then((robots) => {
//     res.send(robots);
//   });
// });

// router.get("/users", auth.ensureLoggedIn, (req, res) => {
//   User.find({ company: req.user.company }).then((users) => {
//     res.send(users);
//   });
// });

// router.get("/robot", auth.ensureLoggedIn, (req, res) => {
//   Robot.findById(req.query.id).then((robot) => {
//     res.send(robot);
//   });
// });

// router.get("/company", auth.ensureLoggedIn, (req, res) => {
//   Company.findById(req.user.company).then((company) => {
//     res.send(company);
//   });
// });

// router.get("/missions", auth.ensureLoggedIn, (req, res) => {
//   Mission.find({ robot: req.query.robotId }).then((missions) => {
//     res.send(missions);
//   });
// });

// router.get("/mission", auth.ensureLoggedIn, (req, res) => {
//   Mission.findbyId(req.query.id).then((mission) => {
//     res.send(mission);
//   });
// });

// router.post("/robot", auth.ensureLoggedIn, (req, res) => {
//   const newRobot = new Robot({
//     company: req.user.company,
//     battery: "100",
//     gps: "42.3601° N, 71.0589° W",
//     brushing: false,
//     emergency_stop: false,
//     manual_control: false,
//     manual_drive_direction: "stop",
//     manual_raise_brushes: "stop",
//     manual_activate_brushes: false,
//     charging: false,
//   });

//   newRobot.save().then((robot) => res.send(robot));
// });

// router.post("/updateUser", auth.ensureLoggedIn, (req, res) => {
//   console.log(req.body);
//   User.findById(req.body.id).then((user) => {
//     if (!user) {
//       res.send({});
//     } else {
//       if ("role" in req.body) {
//         user.role = req.body.role;
//       }
//       user.save().then((user) => res.send(user));
//     }
//   });
// });

// router.post("/updateRobot", auth.ensureLoggedIn, (req, res) => {
//   Robot.findById(req.body.id).then((robot) => {
//     if (!robot) {
//       res.send({});
//     } else {
//       if ("battery" in req.body) {
//         robot.battery = req.body.battery;
//       }
//       if ("gps" in req.body) {
//         robot.gps = req.body.gps;
//       }
//       if ("brushing" in req.body) {
//         robot.brushing = req.body.brushing;
//       }
//       if ("emergency_stop" in req.body) {
//         robot.emergency_stop = req.body.emergency_stop;
//       }
//       if ("manual_control" in req.body) {
//         console.log("*****************SETTING MANUAL CONTROL*****************************");
//         robot.manual_control = req.body.manual_control;
//       }
//       if ("manual_drive_direction" in req.body) {
//         robot.manual_drive_direction = req.body.manual_drive_direction;
//       }
//       if ("manual_raise_brushes" in req.body) {
//         robot.manual_raise_brushes = req.body.manual_raise_brushes;
//       }
//       if ("manual_raise_brushes" in req.body) {
//         robot.manual_activate_brushes = req.body.manual_activate_brushes;
//       }
//       if ("charging" in req.body) {
//         robot.charging = req.body.charging;
//       }
//       console.log(req.body);
//       robot.save().then((robot) => res.send(robot));
//     }
//   });
// });

// router.post("/mission", auth.ensureLoggedIn, (req, res) => {
//   const newMission = new Mission({
//     robot: req.body.robot,
//     waypoints: req.body.waypoints,
//   });

//   newMission.save().then((mission) => res.send(mission));
// });

// // external APIs for RaspberryPi
// router.get("/robotExternal", (req, res) => {
//   Robot.findOne({ onTrackId: req.query.onTrackId }).then((robot) => {
//     res.send(robot);
//   });
// });

// router.post("/updateRobotExternal", (req, res) => {
//   Robot.findOne({ onTrackId: req.query.onTrackId }).then((robot) => {
//     if (!robot) {
//       res.send({});
//     } else {
//       robot.battery = req.query.battery;
//       robot.gps = req.query.gps;
//       robot.brushing = req.query.brushing;
//       robot.emergency_stop = req.query.emergency_stop;
//       robot.manual_control = req.query.manual_control;
//       robot.manual_drive_direction = req.query.manual_drive_direction;
//       robot.manual_raise_brushes = req.query.manual_raise_brushes;
//       robot.manual_activate_brushes = req.query.manual_activate_brushes;
//       robot.charging = req.query.charging;

//       robot.save().then((robot) => res.send(robot));
//     }
//   });
// });

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
