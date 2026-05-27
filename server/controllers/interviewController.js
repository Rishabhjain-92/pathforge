const client = require("../config/groq");
const MockInterview = require("../models/MockInterview");
const User = require("../models/User");

// 1. Start a mock interview session and generate the first question
const startInterview = async (req, res) => {
  try {
    const { role, company, difficulty, type } = req.body;

    if (!role || !company || !difficulty || !type) {
      return res.status(400).json({
        message: "Missing required fields: role, company, difficulty, or type."
      });
    }

    const user = await User.findById(req.user.id);
    const skills = user.skills?.join(", ") || "None listed";
    
    // Construct prompt
    const prompt = `
You are a senior professional interviewer conducting a mock interview.
Candidate Profile:
- Target Role: ${role}
- Target Company: ${company}
- Difficulty Level: ${difficulty}
- Interview Round: ${type}
- Declared Skills: ${skills}
${user.resumeText ? `- Candidate's Resume Text (Excerpt): ${user.resumeText.slice(0, 1500)}` : ""}

Generate the first interview question. The question should be challenging, practical, and highly suitable for a ${difficulty}-level ${type} round for a ${role} role at ${company}.
Make the question concise and realistic.

Respond ONLY in this exact JSON format (no markdown, no extra text, no conversational wrapper):
{
  "question": "<The question content>"
}`;

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 800,
      messages: [
        {
          role: "system",
          content: "You are a professional corporate interviewer. You generate high-quality interview questions in strict JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    });

    const text = response.choices[0].message.content;
    const clean = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(clean);

    if (!parsed.question) {
      throw new Error("Failed to generate a valid question from LLM.");
    }

    // Save mock interview session
    const interview = new MockInterview({
      user: req.user.id,
      role,
      company,
      difficulty,
      type,
      questions: [{ question: parsed.question }],
      currentQuestionIndex: 0,
      status: "in_progress"
    });

    await interview.save();

    res.status(200).json({
      success: true,
      interviewId: interview._id,
      question: parsed.question,
      totalQuestions: 5
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to start mock interview",
      error: error.message
    });
  }
};

// 2. Submit an answer, get a brief evaluation, and get the next question (or finish)
const submitAnswer = async (req, res) => {
  try {
    const { interviewId, answer } = req.body;

    if (!interviewId) {
      return res.status(400).json({ message: "interviewId is required." });
    }

    const interview = await MockInterview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: "Interview session not found." });
    }

    if (interview.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized access to this session." });
    }

    if (interview.status === "completed") {
      return res.status(400).json({ message: "This interview has already been completed." });
    }

    const currentIndex = interview.currentQuestionIndex;
    
    // Save current answer
    interview.questions[currentIndex].answer = answer || "[No response provided]";

    const currentQuestionText = interview.questions[currentIndex].question;
    const isLastQuestion = currentIndex === 4; // 5 questions total (indices 0 to 4)

    let prompt = "";
    if (isLastQuestion) {
      prompt = `
You are a senior professional interviewer at ${interview.company}.
Evaluate the candidate's response to the final question.

Question asked: "${currentQuestionText}"
Candidate's Answer: "${answer}"

Your tasks:
1. Give this answer a score from 0 to 100.
2. Provide a concise 1-2 sentence professional critique.
3. Since this is the final question, you must set "nextQuestion" to null.

Respond ONLY in this exact JSON format:
{
  "score": <0-100>,
  "evaluation": "<critique>",
  "nextQuestion": null
}`;
    } else {
      // Build a short history for turn-based context
      let history = "";
      for (let i = 0; i <= currentIndex; i++) {
        history += `Q${i + 1}: ${interview.questions[i].question}\nA${i + 1}: ${interview.questions[i].answer}\n\n`;
      }

      prompt = `
You are a senior professional interviewer at ${interview.company} conducting a ${interview.difficulty}-level ${interview.type} round for a ${interview.role} role.
Evaluate the candidate's last answer and generate the next logical question.

Current Interview History:
${history}

Last Question asked: "${currentQuestionText}"
Last Answer given: "${answer}"

Your tasks:
1. Give the last answer a score from 0 to 100.
2. Provide a concise 1-2 sentence professional critique.
3. Generate the next logical question (Question ${currentIndex + 2} of 5) that flows naturally or introduces a new relevant topic.

Respond ONLY in this exact JSON format:
{
  "score": <0-100>,
  "evaluation": "<critique>",
  "nextQuestion": "<next question content>"
}`;
    }

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 1000,
      messages: [
        {
          role: "system",
          content: "You are a professional corporate interviewer. You evaluate responses and generate questions in strict JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    });

    const text = response.choices[0].message.content;
    const clean = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(clean);

    // Save evaluation for current question
    interview.questions[currentIndex].score = parsed.score || 0;
    interview.questions[currentIndex].evaluation = parsed.evaluation || "";

    if (isLastQuestion || !parsed.nextQuestion) {
      // Complete interview state
      interview.status = "completed";
      await interview.save();

      return res.status(200).json({
        success: true,
        score: parsed.score,
        evaluation: parsed.evaluation,
        nextQuestion: null,
        completed: true
      });
    } else {
      // Add next question to list and increment pointer
      interview.questions.push({ question: parsed.nextQuestion });
      interview.currentQuestionIndex += 1;
      await interview.save();

      return res.status(200).json({
        success: true,
        score: parsed.score,
        evaluation: parsed.evaluation,
        nextQuestion: parsed.nextQuestion,
        completed: false,
        currentIndex: interview.currentQuestionIndex
      });
    }

  } catch (error) {
    res.status(500).json({
      message: "Failed to submit answer",
      error: error.message
    });
  }
};

// 3. Get comprehensive scorecard and feedback report (compiles if not already done)
const getFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    const interview = await MockInterview.findById(id);
    if (!interview) {
      return res.status(404).json({ message: "Interview session not found." });
    }

    if (interview.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized access to this session." });
    }

    // If feedback is already compiled, return directly
    if (interview.feedback && interview.feedback.overall) {
      return res.status(200).json({
        success: true,
        interview
      });
    }

    // Ensure status is completed to compile
    if (interview.status !== "completed") {
      // Force completion if they are requesting feedback but questions are not done, or auto-complete it
      interview.status = "completed";
    }

    // Compile full transcript for LLM review
    let fullTranscript = "";
    interview.questions.forEach((q, idx) => {
      fullTranscript += `Question ${idx + 1}: ${q.question}\nAnswer: ${q.answer}\nScore: ${q.score}/100. Review: ${q.evaluation}\n\n`;
    });

    const prompt = `
You are an expert talent acquisition manager and technical career coach.
Analyze this complete mock interview transcript for the role of ${interview.role} at ${interview.company} (${interview.difficulty} difficulty, ${interview.type} round).

Interview Transcript:
${fullTranscript}

Generate a comprehensive, professional feedback report.
1. Calculate a final overall score (0-100).
2. Generate sub-scores out of 100 for:
   - Technical Knowledge
   - Communication Skills
   - Problem Solving / Critical Thinking
3. Provide a high-level summary review (3-4 sentences).
4. Identify exactly 3-4 key strengths.
5. Identify exactly 3-4 weaknesses or key growth areas.
6. Provide 3-4 highly actionable tips for future improvement.
7. For each of the questions asked in the interview, provide a detailed "ideal answer" that showcases what a top-tier candidate's response would have included. Make sure there are exactly ${interview.questions.length} ideal answers in the array, matching the chronological order of the questions.

Respond ONLY in this exact JSON format (no markdown, no other text):
{
  "overallScore": <0-100>,
  "ratingBreakdown": {
    "technicalKnowledge": <0-100>,
    "communication": <0-100>,
    "problemSolving": <0-100>
  },
  "overallFeedback": "<comprehensive summary evaluation>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>", "<weakness 3>"],
  "tips": ["<tip 1>", "<tip 2>", "<tip 3>"],
  "idealAnswers": ["<ideal answer for Q1>", "<ideal answer for Q2>", "<ideal answer for Q3>", "<ideal answer for Q4>", "<ideal answer for Q5>"]
}`;

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 3000,
      messages: [
        {
          role: "system",
          content: "You are a professional talent coach. You provide detailed constructive scorecard feedbacks in strict JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    });

    const text = response.choices[0].message.content;
    const clean = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(clean);

    // Save final report data
    interview.overallScore = parsed.overallScore || 0;
    interview.feedback = {
      overall: parsed.overallFeedback || "",
      strengths: parsed.strengths || [],
      weaknesses: parsed.weaknesses || [],
      tips: parsed.tips || [],
      ratingBreakdown: parsed.ratingBreakdown || { technicalKnowledge: 0, communication: 0, problemSolving: 0 },
      idealAnswers: parsed.idealAnswers || []
    };

    await interview.save();

    res.status(200).json({
      success: true,
      interview
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to compile feedback scorecard",
      error: error.message
    });
  }
};

// 4. Get a history of past interviews for the current user
const getHistory = async (req, res) => {
  try {
    const history = await MockInterview.find({ user: req.user.id })
      .select("role company difficulty type overallScore status createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      history
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch interview history",
      error: error.message
    });
  }
};

// 5. Get details of a single interview session
const getInterviewDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const interview = await MockInterview.findById(id);
    if (!interview) {
      return res.status(404).json({ message: "Interview session not found." });
    }

    if (interview.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized access to this session." });
    }

    res.status(200).json({
      success: true,
      interview
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch interview details",
      error: error.message
    });
  }
};

module.exports = {
  startInterview,
  submitAnswer,
  getFeedback,
  getHistory,
  getInterviewDetails
};
