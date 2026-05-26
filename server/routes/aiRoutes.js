const express = require("express");
const router = express.Router();
const { analyzeResume, getAnalysis, listModels, getDailyQuiz } = require("../controllers/aiController");
const protect = require("../middleware/authMiddleware");

router.post("/analyze-resume", protect, analyzeResume);
router.get("/analysis", protect, getAnalysis);
router.get("/models", protect, listModels);
router.get("/daily-quiz", protect, getDailyQuiz);

module.exports = router;