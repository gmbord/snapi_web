const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema({
  player1: { type: mongoose.Types.ObjectId, ref: "User" },
  player2: { type: mongoose.Types.ObjectId, ref: "User" },
  player3: { type: mongoose.Types.ObjectId, ref: "User" },
  player4: { type: mongoose.Types.ObjectId, ref: "User" },
  p1Stats: [Number],
  p2Stats: [Number],
  p3Stats: [Number],
  p4Stats: [Number],
  time: { type: Date, default: Date.now },
  winner: Number,
  status: String,
});

// compile model from schema
module.exports = mongoose.model("game", GameSchema);
