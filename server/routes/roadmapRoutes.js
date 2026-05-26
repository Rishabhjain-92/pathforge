const express = require("express");
const router = express.Router();
const { generateRoadmap, getRoadmap, updateTask } = require("../controllers/roadmapController");
const protect = require("../middleware/authMiddleware");

router.post("/generate", protect, generateRoadmap);
router.get("/", protect, getRoadmap);
router.put("/task", protect, updateTask);

module.exports = router;