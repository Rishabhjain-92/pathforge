const client = require("../config/groq");
const User = require("../models/User");

const generateRoadmap = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.targetRole) {
      return res.status(400).json({ message: "Please set your target role in Profile first." });
    }

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
- Each task must have a difficulty level and a weekNumber
- weekNumber should be 1-4 indicating which week of the month

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
          "difficulty": "<easy/medium/hard>",
          "weekNumber": <1-4>,
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

    // Validate roadmap structure
    if (!roadmapData.months || !Array.isArray(roadmapData.months)) {
      return res.status(500).json({ message: "AI returned invalid roadmap structure. Please try again." });
    }

    for (const month of roadmapData.months) {
      if (!month.tasks || !Array.isArray(month.tasks)) {
        return res.status(500).json({ message: "AI returned invalid month structure. Please try again." });
      }
      if (!month.goals || !Array.isArray(month.goals)) {
        month.goals = [];
      }
      if (!month.milestone) {
        month.milestone = "";
      }
      // Ensure each task has required fields
      month.tasks = month.tasks.map(task => ({
        task: task.task || "Untitled task",
        category: ["DSA", "Project", "Learning", "Interview"].includes(task.category) ? task.category : "Learning",
        difficulty: ["easy", "medium", "hard"].includes(task.difficulty) ? task.difficulty : "medium",
        weekNumber: task.weekNumber || null,
        completed: false,
      }));
    }

    if (!roadmapData.keyMilestones || !Array.isArray(roadmapData.keyMilestones)) {
      roadmapData.keyMilestones = [];
    }
    if (typeof roadmapData.estimatedReadiness !== "number") {
      roadmapData.estimatedReadiness = 70;
    }

    // Save to database
    await User.findByIdAndUpdate(req.user.id, {
      roadmap: JSON.stringify(roadmapData),
      roadmapProgress: 0,
      roadmapGeneratedAt: new Date(),
    });

    res.status(200).json({ success: true, roadmap: roadmapData });

  } catch (error) {
    if (error instanceof SyntaxError) {
      return res.status(500).json({ message: "AI returned invalid JSON. Please try again." });
    }
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

    // Input validation
    if (typeof monthIndex !== "number" || typeof taskIndex !== "number" || typeof completed !== "boolean") {
      return res.status(400).json({ message: "Invalid request. monthIndex, taskIndex (numbers) and completed (boolean) are required." });
    }

    const user = await User.findById(req.user.id);

    if (!user.roadmap) {
      return res.status(400).json({ message: "No roadmap found. Generate one first." });
    }

    const roadmap = JSON.parse(user.roadmap);

    // Bounds validation
    if (monthIndex < 0 || monthIndex >= roadmap.months.length) {
      return res.status(400).json({ message: `Invalid monthIndex: ${monthIndex}. Must be 0-${roadmap.months.length - 1}.` });
    }

    if (taskIndex < 0 || taskIndex >= roadmap.months[monthIndex].tasks.length) {
      return res.status(400).json({ message: `Invalid taskIndex: ${taskIndex}. Must be 0-${roadmap.months[monthIndex].tasks.length - 1}.` });
    }

    // Update the task
    roadmap.months[monthIndex].tasks[taskIndex].completed = completed;

    // Calculate progress
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