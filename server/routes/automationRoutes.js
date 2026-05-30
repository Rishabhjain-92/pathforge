const express = require("express");
const router = express.Router();
const { getActiveUsers, recalibrateUserRoadmap } = require("../controllers/automationController");
const protectAutomation = require("../middleware/automationMiddleware");

// Protected n8n automation routes
router.get("/active-users", protectAutomation, getActiveUsers);
router.post("/recalibrate", protectAutomation, recalibrateUserRoadmap);

module.exports = router;
