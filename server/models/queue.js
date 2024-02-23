const mongoose = require("mongoose");

const QueueSchema = new mongoose.Schema({
  games: [{ type: mongoose.Types.ObjectId, ref: "Game" }],
});

// compile model from schema
module.exports = mongoose.model("queue", QueueSchema);
