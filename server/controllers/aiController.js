const client = require("../config/groq");
const User = require("../models/User");

const analyzeResume = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.resumeText) {
      return res.status(400).json({ message: "No resume found. Please upload first." });
    }

const prompt = `
You are a STRICT ATS system used by Google, Amazon, and top tech companies.
Your job is to CRITICALLY evaluate resumes. Be HARSH and HONEST.

Resume Text:
${user.resumeText}

Target Role: ${user.targetRole || "Software Engineer"}
Target Company: ${user.targetCompany || "Top Tech Company"}

SCORING RULES — BE STRICT:
Factor 1 - Relevant Experience (0-20):
- No relevant projects/internships = 3-5
- 1-2 small projects = 6-10
- Strong projects with impact = 11-15
- Professional experience + strong projects = 16-20

Factor 2 - Technical Skills (0-20):
- Only basic skills (HTML/CSS/JS) = 5-8
- Intermediate skills (React/Node) = 9-13
- Advanced skills (System Design/DSA/Cloud) = 14-17
- Expert level with breadth = 18-20

Factor 3 - Achievements & Metrics (0-20):
- No numbers/metrics at all = 0-4
- Some vague achievements = 5-9
- Few quantified results = 10-14
- Strong quantified impact = 15-20

Factor 4 - Resume Formatting (0-20):
- Poor structure/hard to read = 0-7
- Decent structure = 8-12
- Clean ATS-friendly format = 13-16
- Professional clean format = 17-20

Factor 5 - Keywords Match (0-20):
- Less than 30% keywords matched = 0-6
- 30-50% matched = 7-11
- 50-70% matched = 12-15
- 70%+ matched = 16-20

IMPORTANT:
- A fresh graduate with only college projects should score 35-55 max
- Only score above 75 if there is real work experience with metrics
- Be realistic — most students score between 40-65

Respond ONLY in this exact JSON format, no markdown:
{
  "atsScore": <total of 5 factors>,
  "scoreBreakdown": {
    "relevantExperience": <0-20>,
    "technicalSkills": <0-20>,
    "achievementsAndMetrics": <0-20>,
    "formattingAndClarity": <0-20>,
    "keywordsMatch": <0-20>
  },
  "summary": "<3-4 sentence HONEST critical assessment>",
  "strengths": ["<only genuine strengths>"],
  "missingSkills": ["<critical skills missing for ${user.targetRole || "Software Engineer"} at ${user.targetCompany || "top tech company"}>"],
  "improvements": ["<specific actionable improvements with examples>"],
  "keywords": ["<important ATS keywords missing from resume>"],
  "experienceLevel": "<Fresher/Junior/Mid/Senior>",
  "topSkills": ["<skills actually found in resume>"],
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
const clearAnalysis = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      resumeAnalysis: null,
      readinessScore: null,
    });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { analyzeResume, getAnalysis, listModels, clearAnalysis };
