const express = require("express");
const router = express.Router();
const { generatePrediction } = require("../controllers/astro.controller");
const protect = require("../middleware/auth.middleware");

router.post("/generate", protect, generatePrediction);

module.exports = router;