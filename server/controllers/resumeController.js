const cloudinary = require("../config/cloudinary");
const mammoth = require("mammoth");
const User = require("../models/User");

const extractPdfText = async (buffer) => {
  try {
    const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
    const pdfjsLibResolved = pdfjsLib.default || pdfjsLib;

    const loadingTask = pdfjsLibResolved.getDocument({
      data: new Uint8Array(buffer),
    });
    const pdf = await loadingTask.promise;

    let fullText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((item) => item.str).join(" ");
      fullText += pageText + "\n";
    }

    return fullText.trim();
  } catch (err) {
    console.error("extractPdfText internal error:", err);
    throw new Error(
      typeof err === "string"
        ? err
        : err?.message || JSON.stringify(err) || "Unknown PDF error"
    );
  }
};

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const file = req.file;
    let extractedText = "";

    if (file.mimetype === "application/pdf") {
      extractedText = await extractPdfText(file.buffer);
    } else {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      extractedText = result.value;
    }

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "raw",
            folder: "pathforge/resumes",
            public_id: `resume_${req.user.id}_${Date.now()}`,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(file.buffer);
    });

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
    console.error("Upload error full object:", error);
    res.status(500).json({
      message: "Upload failed",
      error:
        typeof error === "string"
          ? error
          : error?.message || JSON.stringify(error) || "Unknown error",
      stack: error?.stack || "No stack available",
    });
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