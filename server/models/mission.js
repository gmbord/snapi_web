const mongoose = require("mongoose");

const MissionSchema = new mongoose.Schema({
  robot: { type: mongoose.Types.ObjectId, ref: "Robot" },
  waypoints: [String],
});

// compile model from schema
module.exports = mongoose.model("mission", MissionSchema);
