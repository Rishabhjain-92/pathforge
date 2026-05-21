const cloudinary = require("../config/cloudinary");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const User = require("../models/User");

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const file = req.file;
    let extractedText = "";

    // Extract text based on file type
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

    // Update user with resume URL and extracted text
    await User.findByIdAndUpdate(req.user.id, {
      resumeUrl: uploadResult.secure_url,
      resumeText: extractedText,
      resumeFileName: file.originalname,
      resumeUploadedAt: new Date(),
    });

    res.status(200).json({
      success: true,
      message: "Resume uploaded successfully",
      resumeUrl: uploadResult.secure_url,
      fileName: file.originalname,
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