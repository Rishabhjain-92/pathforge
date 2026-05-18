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

module.exports = { getProfile, updateProfile };