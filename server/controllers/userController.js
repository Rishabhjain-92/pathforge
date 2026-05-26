const User = require("../models/User");

// GET PROFILE
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// UPDATE PROFILE
const updateProfile = async (req, res) => {
  try {
    const { name, skills, targetRole, targetCompany, timeline } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { name, skills, targetRole, targetCompany, timeline },
    { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated",
      user: updatedUser
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// UPDATE SETTINGS
const updateSettings = async (req, res) => {
  try {
    const { theme, notifications, emailAlerts } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { settings: { theme, notifications, emailAlerts } },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Settings updated",
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET ANALYTICS DATA
const getAnalyticsData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Mock progress data based on current roadmapProgress
    const roadmapProgress = user.roadmapProgress || 0;
    const progressData = [
      { name: "Day 1", progress: Math.max(0, roadmapProgress - 15) },
      { name: "Day 2", progress: Math.max(0, roadmapProgress - 12) },
      { name: "Day 3", progress: Math.max(0, roadmapProgress - 8) },
      { name: "Day 4", progress: Math.max(0, roadmapProgress - 5) },
      { name: "Day 5", progress: Math.max(0, roadmapProgress - 3) },
      { name: "Day 6", progress: Math.max(0, roadmapProgress - 1) },
      { name: "Today", progress: roadmapProgress },
    ];

    const readinessScore = user.readinessScore || 0;
    const skillDomains = [
      { subject: "Frontend", A: Math.min(100, readinessScore + 10), fullMark: 100 },
      { subject: "Backend", A: Math.max(20, readinessScore - 5), fullMark: 100 },
      { subject: "Database", A: Math.max(30, readinessScore - 10), fullMark: 100 },
      { subject: "Problem Solving", A: readinessScore, fullMark: 100 },
      { subject: "System Design", A: Math.max(10, readinessScore - 15), fullMark: 100 },
      { subject: "DevOps", A: Math.max(0, readinessScore - 30), fullMark: 100 },
    ];

    res.status(200).json({
      success: true,
      progressData,
      skillDomains
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getProfile, updateProfile, updateSettings, getAnalyticsData };