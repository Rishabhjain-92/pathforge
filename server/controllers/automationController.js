const User = require("../models/User");
const client = require("../config/groq");

// GET ACTIVE USERS FOR AUTOMATION
// Returns an array of users who have an active roadmap
const getActiveUsers = async (req, res) => {
  try {
    const users = await User.find({ roadmap: { $ne: null } }).select("-password");

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// RECALIBRATE USER ROADMAP
// AI recalibration based on student's task progress
const recalibrateUserRoadmap = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required for recalibration." });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!user.roadmap) {
      return res.status(400).json({ message: "User has no roadmap to recalibrate." });
    }

    const roadmapData = JSON.parse(user.roadmap);

    // Calculate completed vs pending tasks
    let totalTasks = 0;
    let completedTasks = 0;
    const taskDetails = [];

    roadmapData.months.forEach(month => {
      month.tasks.forEach(task => {
        totalTasks++;
        if (task.completed) {
          completedTasks++;
        }
        taskDetails.push({
          month: month.month,
          taskName: task.task,
          category: task.category,
          completed: task.completed
        });
      });
    });

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // AI Recalibration Prompt
    const prompt = `
You are a senior career mentor at Google, Microsoft, and Amazon.
You are tasked with recalibrating a student's career roadmap based on their actual progress.

Student Profile:
- Name: ${user.name}
- Target Role: ${user.targetRole || "Software Engineer"}
- Target Company: ${user.targetCompany || "Top Tech Company"}
- Current Skills: ${user.skills?.join(", ") || "None"}
- Target Timeline: ${user.timeline || 12} months

Current Roadmap & Progress State:
- Total Tasks: ${totalTasks}
- Completed Tasks: ${completedTasks}
- Overall Progress: ${completionRate}%
- Current Roadmap JSON: 
${user.roadmap}

Instructions:
1. Examine the roadmap and which tasks have been completed vs left uncompleted.
2. If the student has outstanding uncompleted tasks, gently defer or rearrange them in subsequent months without changing the total months drastically (if timeline allows), or increase/decrease readiness score.
3. Update the tasks to help the student catch up. Maintain the weekNumber values.
4. Output a new estimatedReadiness score (0-100) based on their completion rate and goals.
5. Provide a friendly, constructive AI recalibration feedback message in the "recalibrationFeedback" field.

Respond ONLY with a valid JSON object matching this exact format, with no backticks, markdown, or extra explanation text:
{
  "title": "${roadmapData.title}",
  "totalMonths": ${roadmapData.totalMonths},
  "overview": "${roadmapData.overview.replace(/"/g, '\\"')}",
  "recalibrationFeedback": "<Constructive 2-3 sentence AI feedback explaining what was rescheduled and how to stay on track>",
  "months": [
    {
      "month": 1,
      "title": "<Month title>",
      "goals": ["Goal list"],
      "tasks": [
        {
          "task": "<task details>",
          "category": "<DSA/Project/Learning/Interview>",
          "difficulty": "<easy/medium/hard>",
          "weekNumber": <number 1-4>,
          "completed": <keep true if already completed, else false>
        }
      ],
      "milestone": "<milestone achievement>"
    }
  ],
  "keyMilestones": ${JSON.stringify(roadmapData.keyMilestones)},
  "estimatedReadiness": <new predicted readiness score 0-100>
}
`;

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 4000,
      messages: [
        {
          role: "system",
          content: "You are a professional career coach. Recalibrate roadmaps dynamically. Return raw, valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
    });

    const responseText = response.choices[0].message.content;
    const cleanJSON = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    
    let updatedRoadmapData;
    try {
      updatedRoadmapData = JSON.parse(cleanJSON);
    } catch (e) {
      console.error("Failed to parse AI response as JSON. Raw text:", responseText);
      return res.status(500).json({ message: "AI returned invalid JSON structure during recalibration. Please try again." });
    }

    // Update database
    await User.findByIdAndUpdate(userId, {
      roadmap: JSON.stringify(updatedRoadmapData),
      readinessScore: updatedRoadmapData.estimatedReadiness,
      roadmapProgress: completionRate,
      lastRecalibratedAt: new Date()
    });

    res.status(200).json({
      success: true,
      message: "Roadmap successfully recalibrated by AI.",
      previousReadinessScore: user.readinessScore || 0,
      newReadinessScore: updatedRoadmapData.estimatedReadiness,
      completionRate,
      recalibrationFeedback: updatedRoadmapData.recalibrationFeedback,
      roadmap: updatedRoadmapData
    });

  } catch (error) {
    res.status(500).json({ message: "Recalibration failed", error: error.message });
  }
};

module.exports = {
  getActiveUsers,
  recalibrateUserRoadmap
};
