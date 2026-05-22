const model = require("../config/gemini");
const User = require("../models/User");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const analyzeResume = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.resumeText) {
      return res.status(400).json({ message: "No resume found. Please upload first." });
    }

    const prompt = `
You are an expert ATS and career advisor.
Analyze the following resume text.

Resume Text:
${user.resumeText}

Target Role: ${user.targetRole || "Software Engineer"}
Target Company: ${user.targetCompany || "Tech Company"}

Respond ONLY with a valid JSON object, no markdown, no backticks:
{
  "atsScore": <number 0-100>,
  "summary": "<2-3 sentence summary>",
  "strengths": ["<s1>", "<s2>", "<s3>"],
  "missingSkills": ["<s1>", "<s2>", "<s3>", "<s4>", "<s5>"],
  "improvements": ["<i1>", "<i2>", "<i3>", "<i4>"],
  "keywords": ["<k1>", "<k2>", "<k3>", "<k4>", "<k5>"],
  "experienceLevel": "<Fresher/Junior/Mid/Senior>",
  "topSkills": ["<s1>", "<s2>", "<s3>", "<s4>", "<s5>"]
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const clean = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const analysis = JSON.parse(clean);

    await User.findByIdAndUpdate(req.user.id, {
      readinessScore: analysis.atsScore,
      resumeAnalysis: JSON.stringify(analysis),
    });

    res.status(200).json({ success: true, analysis });

  } catch (error) {
    res.status(500).json({ message: "AI analysis failed", error: error.message });
  }
};

const getAnalysis = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.resumeAnalysis) {
      return res.status(200).json({ success: true, analysis: null });
    }
    res.status(200).json({ success: true, analysis: JSON.parse(user.resumeAnalysis) });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const listModels = async (req, res) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
    );
    const data = await response.json();
    const models = data.models?.map(m => m.name) || [];
    res.json({ models });
  } catch (error) {
    res.json({ error: error.message });
  }
};

module.exports = { analyzeResume, getAnalysis, listModels };