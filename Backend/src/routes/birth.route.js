const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth.middleware");
const {
  saveBirthDetails,
  getMyBirthDetails,
} = require("../controllers/birth.controller");

router.post("/save", protect, saveBirthDetails);
router.get("/me", protect, getMyBirthDetails);

module.exports = router;