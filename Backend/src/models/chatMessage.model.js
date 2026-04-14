const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  text: {
    type: String,
    required: true,
    trim: true,
  },
  sender: {
    type: String,
    enum: ["user", "ai"],
    required: true,
  },
}, { timestamps: true });

chatMessageSchema.index({ userId: 1, createdAt: 1 });

module.exports = mongoose.model("ChatMessage", chatMessageSchema);
