const express = require("express");
const router = express.Router();
const { generatePrediction, generateGroundedReport, getGroundedEvidence } = require("../controllers/astro.controller");
const protect = require("../middleware/auth.middleware");

// Phase 1+2 legacy route — preserved for backward compatibility
router.post("/generate", protect, generatePrediction);

// Phase 3 — Grounded prediction (Swiss Ephemeris -> Rule Engine -> Gemini)
router.post("/grounded-report", protect, generateGroundedReport);

// Phase 3 — Evidence only (no Gemini), for debugging and chatbot grounding
router.get("/evidence", protect, getGroundedEvidence);
router.post("/evidence", protect, getGroundedEvidence);

module.exports = router;
