const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  birthHash: {
    type: String,
    required: true,
    index: true,
  },
  report: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
}, { timestamps: true });

reportSchema.index({ userId: 1, birthHash: 1 }, { unique: true });

module.exports = mongoose.model("AstroReport", reportSchema);
