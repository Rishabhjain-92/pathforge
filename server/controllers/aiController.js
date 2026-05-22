const client = require("../config/groq");
const User = require("../models/User");

const analyzeResume = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.resumeText) {
      return res.status(400).json({ message: "No resume found. Please upload first." });
    }

const prompt = `
You are an ATS system and Senior HR Manager with 15+ years at top tech companies.

Resume Text:
${user.resumeText}

Target Role: ${user.targetRole || "Software Engineer"}
Target Company: ${user.targetCompany || "Tech Company"}

STEP 1 — EVALUATE these 5 factors individually first (internal reasoning):
1. Relevant Experience (0-20): Does experience match the target role?
2. Technical Skills (0-20): Are the right skills present and strong?
3. Achievements & Metrics (0-20): Are results quantified? (e.g. "increased sales by 30%")
4. Resume Formatting & Clarity (0-20): Is it clean, readable, ATS-friendly?
5. Keywords Match (0-20): Does it contain keywords for the target role?

STEP 2 — Add the 5 scores together. That is your atsScore (0-100).

STRICT RULES:
- Score each factor independently and honestly
- Missing quantifiable achievements = max 8/20 on factor 3
- Vague skills like "MS Office", "teamwork" = max 10/20 on factor 2
- No relevant experience = max 5/20 on factor 1
- Do NOT normalize or round up the final score

Respond ONLY with a valid JSON object, no markdown, no backticks:
{
  "atsScore": <sum of 5 factors>,
  "scoreBreakdown": {
    "relevantExperience": <0-20>,
    "technicalSkills": <0-20>,
    "achievementsAndMetrics": <0-20>,
    "formattingAndClarity": <0-20>,
    "keywordsMatch": <0-20>
  },
  "summary": "<2-3 sentence honest summary>",
  "strengths": ["<real strengths only>"],
  "missingSkills": ["<critical missing skills for target role>"],
  "improvements": ["<specific actionable improvements>"],
  "keywords": ["<important ATS keywords missing>"],
  "experienceLevel": "<Fresher/Junior/Mid/Senior>",
  "topSkills": ["<actual skills found>"],
  "verdict": "<STRONG PASS / PASS / BORDERLINE / FAIL>"
}`;

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile", // free, fast, very capable
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.choices[0].message.content;
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
  const models = [
    "llama-3.3-70b-versatile",
    "llama-3.1-8b-instant",
    "mixtral-8x7b-32768",
  ];
  res.json({ models });
};

module.exports = { analyzeResume, getAnalysis, listModels };