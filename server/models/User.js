const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    skills: {
      type: [String],
      default: [],
    },
    targetRole: {
      type: String,
      default: "",
    },
    targetCompany: {
      type: String,
      default: "",
    },
    timeline: {
      type: Number,
      default: 12,
    },
    readinessScore: {
      type: Number,
      default: 0,
    },
    roadmapProgress: {
      type: Number,
      default: 0,
    },
    resumeUrl: {
      type: String,
      default: "",
    },
    resumeText: {
      type: String,
      default: "",
    },
    resumeFileName: {
      type: String,
      default: "",
    },
    resumeUploadedAt: {
      type: Date,
    },
    resumeAnalysis: {
      type: String,
     default: "",
   },
   roadmap: {
  type: String,
  default: "",
},
roadmapGeneratedAt: {
  type: Date,
},
    
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);