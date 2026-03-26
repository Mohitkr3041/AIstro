const mongoose = require("mongoose");

const birthSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  name: String,
  dob: String,
  tob: String,
  place: String

}, { timestamps: true });

module.exports = mongoose.model("BirthDetails", birthSchema);