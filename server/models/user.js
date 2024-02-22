const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  googleid: String,
  role: { type: String, enum: ["admin", "view_only", "dispatcher", "operator"] },
  company: { type: mongoose.Types.ObjectId, ref: "Company" },
  email: String,
});

// compile model from schema
module.exports = mongoose.model("user", UserSchema);
