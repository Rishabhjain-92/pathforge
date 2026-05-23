const cloudinary = require("../config/cloudinary");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const User = require("../models/User");

// Common skills to extract from resume
const SKILL_KEYWORDS = [
  "javascript", "typescript", "python", "java", "c++", "c#", "go", "rust", "swift", "kotlin",
  "react", "next.js", "vue", "angular", "svelte", "html", "css", "tailwind",
  "node.js", "express", "fastapi", "flask", "django", "spring boot",
  "mongodb", "postgresql", "mysql", "redis", "firebase", "supabase",
  "aws", "gcp", "azure", "docker", "kubernetes", "terraform", "linux",
  "git", "github", "ci/cd", "jenkins", "graphql", "rest apis",
  "machine learning", "deep learning", "tensorflow", "pytorch", "scikit-learn",
  "pandas", "numpy", "data science", "nlp", "computer vision",
  "dsa", "system design", "microservices", "distributed systems",
  "react native", "flutter", "android", "ios",
  "figma", "photoshop", "ui/ux",
  "sql", "nosql", "elasticsearch", "kafka", "rabbitmq",
];

const extractSkillsFromText = (text) => {
  const lowerText = text.toLowerCase();
  const foundSkills = [];

  SKILL_KEYWORDS.forEach(skill => {
    if (lowerText.includes(skill.toLowerCase())) {
      // Capitalize properly
      const capitalized = skill
        .split(" ")
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      if (!foundSkills.includes(capitalized)) {
        foundSkills.push(capitalized);
      }
    }
  });

  return foundSkills;
};

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const file = req.file;
    let extractedText = "";

 if (file.mimetype === "application/pdf") {
  const pdfData = await pdfParse(file.buffer);
  extractedText = pdfData.text;
} else {
  const result = await mammoth.extractRawText({ buffer: file.buffer });
  extractedText = result.value;
}

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          folder: "pathforge/resumes",
          public_id: `resume_${req.user.id}_${Date.now()}`,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(file.buffer);
    });

    // Extract skills from resume
    const extractedSkills = extractSkillsFromText(extractedText);

    // Get existing user skills
    const user = await User.findById(req.user.id);
    const existingSkills = user.skills || [];

    // Merge skills — no duplicates
    const mergedSkills = [...new Set([
      ...existingSkills,
      ...extractedSkills
    ])];

    // Update user
    await User.findByIdAndUpdate(req.user.id, {
      resumeUrl: uploadResult.secure_url,
      resumeText: extractedText,
      resumeFileName: file.originalname,
      resumeUploadedAt: new Date(),
      skills: mergedSkills,
    });

    res.status(200).json({
      success: true,
      message: "Resume uploaded successfully",
      resumeUrl: uploadResult.secure_url,
      fileName: file.originalname,
      extractedSkills,
      totalSkillsFound: extractedSkills.length,
      extractedText: extractedText.slice(0, 500),
    });

  } catch (error) {
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};

const getResume = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "resumeUrl resumeFileName resumeUploadedAt resumeText"
    );

    res.status(200).json({
      success: true,
      resume: {
        url: user.resumeUrl || null,
        fileName: user.resumeFileName || null,
        uploadedAt: user.resumeUploadedAt || null,
        hasResume: !!user.resumeUrl,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { uploadResume, getResume };