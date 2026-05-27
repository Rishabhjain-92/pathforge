const mongoose = require("mongoose");

const mockInterviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      required: true,
      enum: ["Beginner", "Intermediate", "Advanced"],
    },
    type: {
      type: String,
      required: true,
      enum: ["Technical", "Behavioral"],
    },
    status: {
      type: String,
      enum: ["in_progress", "completed"],
      default: "in_progress",
    },
    questions: [
      {
        question: {
          type: String,
          required: true,
        },
        answer: {
          type: String,
          default: "",
        },
        evaluation: {
          type: String,
          default: "",
        },
        score: {
          type: Number,
          default: 0,
        },
      },
    ],
    currentQuestionIndex: {
      type: Number,
      default: 0,
    },
    feedback: {
      overall: {
        type: String,
        default: "",
      },
      strengths: {
        type: [String],
        default: [],
      },
      weaknesses: {
        type: [String],
        default: [],
      },
      tips: {
        type: [String],
        default: [],
      },
      ratingBreakdown: {
        technicalKnowledge: {
          type: Number,
          default: 0,
        },
        communication: {
          type: Number,
          default: 0,
        },
        problemSolving: {
          type: Number,
          default: 0,
        },
      },
      idealAnswers: {
        type: [String],
        default: [],
      },
    },
    overallScore: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("MockInterview", mockInterviewSchema);
