const express = require("express");
const router = express.Router();
const {
  startInterview,
  submitAnswer,
  getFeedback,
  getHistory,
  getInterviewDetails
} = require("../controllers/interviewController");
const protect = require("../middleware/authMiddleware");

// All routes are protected by auth token
router.post("/start", protect, startInterview);
router.post("/submit", protect, submitAnswer);
router.get("/feedback/:id", protect, getFeedback);
router.get("/history", protect, getHistory);
router.get("/:id", protect, getInterviewDetails);

module.exports = router;
