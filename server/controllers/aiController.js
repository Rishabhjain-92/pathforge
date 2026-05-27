const client = require("../config/groq");
const User = require("../models/User");

const analyzeResume = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.resumeText) {
      return res.status(400).json({
        message: "No resume found. Please upload first."
      });
    }

    const prompt = `
You are a STRICT ATS system used by Google, Amazon, and top tech companies.
Analyze ONLY this resume text below. Ignore any previous context.

THIS IS THE ONLY RESUME TO ANALYZE:
---START---
${user.resumeText}
---END---

Target Role: ${user.targetRole || "Software Engineer"}
Target Company: ${user.targetCompany || "Top Tech Company"}

SCORING RULES — BE STRICT:
Factor 1 - Relevant Experience (0-20):
- No relevant projects/internships = 3-5
- 1-2 small projects = 6-10
- Strong projects with impact = 11-15
- Professional experience = 16-20

Factor 2 - Technical Skills (0-20):
- Only basic skills = 5-8
- Intermediate skills = 9-13
- Advanced skills = 14-17
- Expert level = 18-20

Factor 3 - Achievements & Metrics (0-20):
- No numbers/metrics = 0-4
- Vague achievements = 5-9
- Few quantified results = 10-14
- Strong quantified impact = 15-20

Factor 4 - Resume Formatting (0-20):
- Poor structure = 0-7
- Decent structure = 8-12
- Clean ATS-friendly = 13-16
- Professional format = 17-20

Factor 5 - Keywords Match (0-20):
- Less than 30% = 0-6
- 30-50% = 7-11
- 50-70% = 12-15
- 70%+ = 16-20

RULES:
- Fresh graduate with only projects = max 55
- Score above 75 only if real work experience with metrics
- Most students score 40-65

Respond ONLY in this exact JSON, no markdown, no extra text:
{
  "atsScore": <total>,
  "scoreBreakdown": {
    "relevantExperience": <0-20>,
    "technicalSkills": <0-20>,
    "achievementsAndMetrics": <0-20>,
    "formattingAndClarity": <0-20>,
    "keywordsMatch": <0-20>
  },
  "summary": "<3-4 sentence honest assessment of THIS resume>",
  "strengths": ["<actual strengths from THIS resume>"],
  "missingSkills": ["<skills missing for ${user.targetRole || "Software Engineer"}>"],
  "improvements": ["<specific improvements for THIS resume>"],
  "keywords": ["<ATS keywords missing>"],
  "experienceLevel": "<Fresher/Junior/Mid/Senior>",
  "topSkills": ["<skills found in THIS resume>"],
  "verdict": "<STRONG PASS / PASS / BORDERLINE / FAIL>"
}`;

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 1024,
      temperature: 0,
      messages: [
        {
          role: "system",
          content: "You are a strict ATS analyzer. Analyze ONLY the resume provided. No memory of previous resumes."
        },
        {
          role: "user",
          content: prompt
        }
      ],
    });

    const text = response.choices[0].message.content;
    const clean = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const analysis = JSON.parse(clean);

    await User.findByIdAndUpdate(req.user.id, {
      readinessScore: analysis.atsScore,
      resumeAnalysis: JSON.stringify(analysis),
      resumeAnalyzedAt: new Date(),
    });

    res.status(200).json({ success: true, analysis });

  } catch (error) {
    res.status(500).json({
      message: "AI analysis failed",
      error: error.message
    });
  }
};


const getAnalysis = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.resumeAnalysis) {
      return res.status(200).json({ success: true, analysis: null });
    }
    res.status(200).json({
      success: true,
      analysis: JSON.parse(user.resumeAnalysis)
    });
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

const getDailyQuiz = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Check if we already generated a quiz today
    const today = new Date();
    today.setHours(0, 0, 0, 0); // start of today
    
    if (user.dailyQuiz && user.dailyQuizDate) {
      const quizDate = new Date(user.dailyQuizDate);
      quizDate.setHours(0, 0, 0, 0);
      
      if (quizDate.getTime() === today.getTime()) {
        // Return cached quiz
        return res.status(200).json({ success: true, quiz: JSON.parse(user.dailyQuiz) });
      }
    }
    
    // Generate new quiz
    const prompt = `
Generate ONE challenging multiple-choice technical interview question for a ${user.targetRole || "Software Engineer"}.

RULES:
- Must have exactly 3 options.
- Only one correct answer.
- Explanation must be concise (1-2 sentences) and helpful.
- Difficulty should be medium to hard.

Respond ONLY in this exact JSON format, no markdown:
{
  "question": "<The question text>",
  "options": ["<option 1>", "<option 2>", "<option 3>"],
  "correctIndex": <0, 1, or 2>,
  "explanation": "<Concise explanation>"
}`;

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 1000,
      messages: [
        {
          role: "system",
          content: "You are a senior technical interviewer. Generate technical quizzes only. Return valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
    });

    const text = response.choices[0].message.content;
    const clean = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const quizData = JSON.parse(clean);
    
    // Validate AI output
    if (!quizData.question || !Array.isArray(quizData.options) || quizData.options.length !== 3 || typeof quizData.correctIndex !== "number") {
      throw new Error("Invalid AI generated quiz structure");
    }

    // Save to user DB
    await User.findByIdAndUpdate(req.user.id, {
      dailyQuiz: JSON.stringify(quizData),
      dailyQuizDate: new Date(),
    });

    res.status(200).json({ success: true, quiz: quizData });

  } catch (error) {
    // If AI fails, return a fallback static quiz based on role
    const fallbackQuiz = {
      question: "Which of the following data structures provides O(1) time complexity for both search and insert on average?",
      options: [
        "Binary Search Tree",
        "Hash Table",
        "Min Heap"
      ],
      correctIndex: 1,
      explanation: "A Hash Table provides average O(1) time complexity for search and insertion due to its key-value mapping via a hash function."
    };
    res.status(200).json({ success: true, quiz: fallbackQuiz });
  }
};

const generateRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    const targetRole = user.targetRole || "Software Engineer";
    const targetCompany = user.targetCompany || "Top Tech Company";
    const skills = user.skills?.join(", ") || "None";
    const readiness = user.readinessScore || 0;

    // Parse resume analysis for missing skills if available
    let missingSkills = [];
    if (user.resumeAnalysis) {
      try {
        const analysis = JSON.parse(user.resumeAnalysis);
        missingSkills = analysis.missingSkills || [];
      } catch (e) {}
    }

    const prompt = `
You are a senior career coach at a top tech company. Generate a COMPREHENSIVE and personalized career action plan.

CANDIDATE PROFILE:
- Target Role: ${targetRole}
- Target Company: ${targetCompany}
- Current Skills: ${skills}
- Readiness Score: ${readiness}/100
- Missing Skills: ${missingSkills.join(", ") || "Not analyzed yet"}

Generate recommendations in this EXACT JSON format (no extra text, no markdown):
{
  "missingSkills": ["<skill 1>", "<skill 2>", "<skill 3>", "<skill 4>", "<skill 5>"],
  "projects": [
    {
      "title": "<project name>",
      "description": "<what this project does, 1-2 sentences>",
      "techStack": ["<tech 1>", "<tech 2>", "<tech 3>"],
      "whyBuild": "<why this project is great for resume, 1 sentence>",
      "difficulty": "<Beginner|Intermediate|Advanced>",
      "estimatedTime": "<e.g., 2-3 weeks>"
    }
  ],
  "courses": [
    {
      "title": "<course/resource name>",
      "platform": "<YouTube|Coursera|Udemy|LeetCode|freeCodeCamp|Docs>",
      "description": "<what you'll learn, 1 sentence>",
      "skillsCovered": ["<skill 1>", "<skill 2>"],
      "difficulty": "<Beginner|Intermediate|Advanced>",
      "estimatedTime": "<e.g., 10 hours>",
      "link": "<search URL or direct link>"
    }
  ],
  "interviewStrategies": [
    {
      "title": "<strategy title>",
      "description": "<actionable tip, 2-3 sentences>",
      "category": "<Technical|Behavioral|System Design|Resume>"
    }
  ],
  "focusAreas": ["<area 1>", "<area 2>", "<area 3>"]
}

RULES:
- Generate exactly 3 projects that cover the missing skills
- Generate exactly 4-5 courses from real platforms
- Generate exactly 3 interview strategies specific to ${targetCompany}
- Generate exactly 3 focus areas
- Be specific and actionable, not generic
- Projects should be portfolio-worthy
`;

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 2500,
      messages: [
        {
          role: "system",
          content: "You are a senior career coach at Google. You provide extremely specific, actionable career guidance. Return valid JSON only, no markdown."
        },
        {
          role: "user",
          content: prompt
        }
      ],
    });

    const text = response.choices[0].message.content;
    const clean = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const recommendationsData = JSON.parse(clean);

    // Store context for Smart Sync detection
    const context = {
      targetRole: user.targetRole || "",
      targetCompany: user.targetCompany || "",
      skillsCount: user.skills?.length || 0,
    };

    await User.findByIdAndUpdate(req.user.id, {
      recommendations: JSON.stringify(recommendationsData),
      recommendationsGeneratedAt: new Date(),
      recommendationsContext: context,
    });

    res.status(200).json({
      success: true,
      recommendations: recommendationsData,
      context,
      generatedAt: new Date(),
    });

  } catch (error) {
    res.status(500).json({ message: "Failed to generate recommendations", error: error.message });
  }
};

const getRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.recommendations) {
      return res.status(200).json({ success: true, recommendations: null });
    }
    res.status(200).json({
      success: true,
      recommendations: JSON.parse(user.recommendations),
      context: user.recommendationsContext || null,
      generatedAt: user.recommendationsGeneratedAt || null,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { analyzeResume, getAnalysis, listModels, getDailyQuiz, generateRecommendations, getRecommendations };