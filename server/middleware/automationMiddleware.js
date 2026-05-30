const protectAutomation = (req, res, next) => {
  const automationKey = req.headers["x-automation-key"];
  const configuredKey = process.env.AUTOMATION_API_KEY;

  if (!configuredKey) {
    console.error("WARNING: AUTOMATION_API_KEY is not configured in environment variables.");
    return res.status(500).json({ message: "Automation server configuration error" });
  }

  if (!automationKey || automationKey !== configuredKey) {
    return res.status(401).json({ message: "Unauthorized automation access: Invalid or missing API key" });
  }

  next();
};

module.exports = protectAutomation;
