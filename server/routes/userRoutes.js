const { getProfile, updateProfile, updateSettings, getAnalyticsData } = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/settings", protect, updateSettings);
router.get("/analytics", protect, getAnalyticsData);
module.exports = router;