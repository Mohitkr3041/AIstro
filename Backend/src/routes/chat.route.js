const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth.middleware");
const { askAstroChat } = require("../controllers/chat.controller");

router.post("/ask", protect, askAstroChat);

module.exports = router;