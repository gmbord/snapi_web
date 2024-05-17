const mongoose = require("mongoose");

const UserStatSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: "User", required: true }, // Reference to User model
  stat: { type: Number, required: true }, // User's stat
});

const LeaderboardSchema = new mongoose.Schema({
  games_played: {
    type: [UserStatSchema],
    required: true,
    validate: [arrayLimit, "{PATH} exceeds the limit of 5"],
  },
  total_wins: {
    type: [UserStatSchema],
    required: true,
    validate: [arrayLimit, "{PATH} exceeds the limit of 5"],
  },
  total_tosses: {
    type: [UserStatSchema],
    required: true,
    validate: [arrayLimit, "{PATH} exceeds the limit of 5"],
  },
  total_points: {
    type: [UserStatSchema],
    required: true,
    validate: [arrayLimit, "{PATH} exceeds the limit of 5"],
  },
  total_catches: {
    type: [UserStatSchema],
    required: true,
    validate: [arrayLimit, "{PATH} exceeds the limit of 5"],
  },
  total_drops: {
    type: [UserStatSchema],
    required: true,
    validate: [arrayLimit, "{PATH} exceeds the limit of 5"],
  },
  points_per_toss: {
    type: [UserStatSchema],
    required: true,
    validate: [arrayLimit, "{PATH} exceeds the limit of 5"],
  },
  catches_per_drop: {
    type: [UserStatSchema],
    required: true,
    validate: [arrayLimit, "{PATH} exceeds the limit of 5"],
  },
});

function arrayLimit(val) {
  return val.length <= 5;
}

// Compile model from schema
module.exports = mongoose.model("Leaderboard", LeaderboardSchema);
