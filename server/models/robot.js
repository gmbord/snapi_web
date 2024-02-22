const mongoose = require("mongoose");

const RobotSchema = new mongoose.Schema({
  company: { type: mongoose.Types.ObjectId, ref: "Company" },
  onTrackId: Number,
  battery: Number,
  gps: String,
  brushing: Boolean,
  emergency_stop: Boolean,
  manual_control: Boolean,
  manual_drive_direction: { type: String, enum: ["stop", "forwards", "backwards"] },
  manual_raise_brushes: { type: String, enum: ["stop", "raise", "lower"] },
  manual_activate_brushes: Boolean,
  charging: Boolean,
});

// compile model from schema
module.exports = mongoose.model("robot", RobotSchema);
