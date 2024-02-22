const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema({
  name: String,
  region: String,
});

module.exports = mongoose.model("company", CompanySchema);
