const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth.middleware");
const createRateLimiter = require("../middleware/rateLimit.middleware");
const { askAstroChat, getChatHistory } = require("../controllers/chat.controller");

const chatRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 8,
  message: "Too many AI requests. Please wait a minute and try again.",
});

router.get("/history", protect, getChatHistory);
router.post("/ask", protect, chatRateLimiter, askAstroChat);

module.exports = router;
