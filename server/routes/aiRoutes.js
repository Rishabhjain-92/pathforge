const express = require("express");
const router = express.Router();
const { analyzeResume, getAnalysis, listModels,clearAnalysis } = require("../controllers/aiController");
const protect = require("../middleware/authMiddleware");

router.post("/analyze-resume", protect, analyzeResume);
router.get("/analysis", protect, getAnalysis);
router.delete("/analysis", protect, clearAnalysis);
router.get("/models", protect, listModels);

module.exports = router;