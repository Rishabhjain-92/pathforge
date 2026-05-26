const client = require("../config/groq");
const User = require("../models/User");

const generateRoadmap = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const prompt = `
You are a senior career mentor at top tech companies.

Student Profile:
- Current Skills: ${user.skills?.join(", ") || "None"}
- Target Role: ${user.targetRole || "Software Engineer"}
- Target Company: ${user.targetCompany || "Top Tech Company"}
- Timeline: ${user.timeline || 12} months

Generate a realistic month-by-month career roadmap.

RULES:
- Be specific and practical
- Tasks should be achievable
- Focus on skills needed for target role
- Include DSA, projects, and soft skills

Respond ONLY in this exact JSON format, no markdown:
{
  "title": "Roadmap to ${user.targetRole} at ${user.targetCompany}",
  "totalMonths": ${user.timeline || 12},
  "overview": "<2-3 sentence overview of the plan>",
  "months": [
    {
      "month": 1,
      "title": "<Month theme e.g. Foundation Building>",
      "goals": ["<goal 1>", "<goal 2>", "<goal 3>"],
      "tasks": [
        {
          "task": "<specific task>",
          "category": "<DSA/Project/Learning/Interview>",
          "completed": false
        }
      ],
      "milestone": "<What you should achieve by end of month>"
    }
  ],
  "keyMilestones": ["<milestone 1>", "<milestone 2>", "<milestone 3>"],
  "estimatedReadiness": <number 0-100>
}`;

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 4000,
      messages: [
        {
          role: "system",
          content: "You are a strict career mentor. Generate realistic roadmaps only. Return valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
    });

    const text = response.choices[0].message.content;
    const clean = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const roadmapData = JSON.parse(clean);

    // Save to database
    await User.findByIdAndUpdate(req.user.id, {
      roadmap: JSON.stringify(roadmapData),
      roadmapProgress: 0,
      roadmapGeneratedAt: new Date(),
    });

    res.status(200).json({ success: true, roadmap: roadmapData });

  } catch (error) {
    res.status(500).json({ message: "Failed to generate roadmap", error: error.message });
  }
};

const getRoadmap = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.roadmap) {
      return res.status(200).json({ success: true, roadmap: null });
    }

    res.status(200).json({
      success: true,
      roadmap: JSON.parse(user.roadmap)
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { monthIndex, taskIndex, completed } = req.body;

    const user = await User.findById(req.user.id);
    const roadmap = JSON.parse(user.roadmap);

    // Task update karo
    roadmap.months[monthIndex].tasks[taskIndex].completed = completed;

    // Progress calculate karo
    const totalTasks = roadmap.months.reduce(
      (sum, month) => sum + month.tasks.length, 0
    );
    const completedTasks = roadmap.months.reduce(
      (sum, month) => sum + month.tasks.filter(t => t.completed).length, 0
    );
    const progress = Math.round((completedTasks / totalTasks) * 100);

    await User.findByIdAndUpdate(req.user.id, {
      roadmap: JSON.stringify(roadmap),
      roadmapProgress: progress,
    });

    res.status(200).json({
      success: true,
      progress,
      completedTasks,
      totalTasks
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { generateRoadmap, getRoadmap, updateTask };