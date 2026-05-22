import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, FileText, CheckCircle,
  AlertCircle, Trash2, ExternalLink,
  TrendingUp, Zap
} from "lucide-react";

const Resume = () => {
  const [resume, setResume] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileRef = useRef(null);

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:5000/api/resume",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResume(res.data.resume);
    } catch (error) {
      console.error("Failed to fetch resume");
    }
  };

  const handleUpload = async (file) => {
    if (!file) return;

    const allowed = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowed.includes(file.type)) {
      setError("Only PDF and DOCX files allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("resume", file);

      await axios.post(
        "http://localhost:5000/api/resume/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccess("Resume uploaded successfully!");
      setTimeout(() => setSuccess(""), 3000);
      fetchResume();
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleUpload(file);
  };

  const formatDate = (date) => {
    if (!date) return "Unknown";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric"
    });
  };

  const formatSize = (bytes) => {
    if (!bytes) return "";
    return `${(bytes / 1024).toFixed(0)} KB`;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", position: "relative" }}>

      {/* Background glow */}
      <div style={{ position: "fixed", top: "150px", right: "150px", width: "300px", height: "300px", background: "radial-gradient(circle, rgba(249,115,22,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ color: "white", fontSize: "22px", fontWeight: "700" }}>Resume Analysis</h1>
        <p style={{ color: "#6B7280", fontSize: "14px", marginTop: "4px" }}>
          Upload your resume for AI-powered analysis and ATS scoring
        </p>
      </motion.div>

      {/* Success/Error Messages */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ display: "flex", alignItems: "center", gap: "10px", backgroundColor: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", color: "#4ADE80", padding: "12px 16px", borderRadius: "12px", fontSize: "14px" }}
          >
            <CheckCircle size={16} />
            {success}
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ display: "flex", alignItems: "center", gap: "10px", backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#F87171", padding: "12px 16px", borderRadius: "12px", fontSize: "14px" }}
          >
            <AlertCircle size={16} />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Area */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          style={{
            border: `2px dashed ${dragOver ? "#F97316" : "#374151"}`,
            borderRadius: "20px",
            padding: "48px 24px",
            textAlign: "center",
            cursor: "pointer",
            backgroundColor: dragOver ? "rgba(249,115,22,0.05)" : "#111827",
            transition: "all 0.3s",
          }}
        >
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.docx"
            style={{ display: "none" }}
            onChange={(e) => handleUpload(e.target.files[0])}
          />

          {uploading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{ width: "48px", height: "48px", border: "3px solid rgba(249,115,22,0.3)", borderTop: "3px solid #F97316", borderRadius: "50%" }}
              />
              <p style={{ color: "#F97316", fontSize: "16px", fontWeight: "600" }}>Uploading your resume...</p>
              <p style={{ color: "#6B7280", fontSize: "13px" }}>Please wait</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ width: "64px", height: "64px", backgroundColor: "rgba(249,115,22,0.1)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <Upload size={28} color="#F97316" />
              </motion.div>
              <div>
                <p style={{ color: "white", fontSize: "18px", fontWeight: "600" }}>
                  Drop your resume here
                </p>
                <p style={{ color: "#6B7280", fontSize: "14px", marginTop: "6px" }}>
                  or <span style={{ color: "#F97316", cursor: "pointer" }}>click to browse</span>
                </p>
              </div>
              <p style={{ color: "#4B5563", fontSize: "13px" }}>
                Supports PDF and DOCX • Max 5MB
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Resume Info — if uploaded */}
      <AnimatePresence>
        {resume?.hasResume && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px" }}
          >
            {/* File Card */}
            <div style={{ backgroundColor: "#111827", border: "1px solid #1F2937", borderRadius: "16px", padding: "20px", display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ width: "44px", height: "44px", backgroundColor: "rgba(249,115,22,0.1)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <FileText size={22} color="#F97316" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: "#9CA3AF", fontSize: "12px" }}>Resume File</p>
                <p style={{ color: "white", fontSize: "14px", fontWeight: "600", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: "3px" }}>
                  {resume.fileName}
                </p>
              </div>
            </div>

            {/* Upload Date */}
            <div style={{ backgroundColor: "#111827", border: "1px solid #1F2937", borderRadius: "16px", padding: "20px", display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ width: "44px", height: "44px", backgroundColor: "rgba(96,165,250,0.1)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <CheckCircle size={22} color="#60A5FA" />
              </div>
              <div>
                <p style={{ color: "#9CA3AF", fontSize: "12px" }}>Uploaded On</p>
                <p style={{ color: "white", fontSize: "14px", fontWeight: "600", marginTop: "3px" }}>
                  {formatDate(resume.uploadedAt)}
                </p>
              </div>
            </div>

            {/* View/Download */}
            <div
              onClick={() => window.open(resume.url, "_blank")}
              style={{ backgroundColor: "#111827", border: "1px solid #1F2937", borderRadius: "16px", padding: "20px", display: "flex", alignItems: "center", gap: "14px", cursor: "pointer" }}
            >
              <div style={{ width: "44px", height: "44px", backgroundColor: "rgba(74,222,128,0.1)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <ExternalLink size={22} color="#4ADE80" />
              </div>
              <div>
                <p style={{ color: "#9CA3AF", fontSize: "12px" }}>View Resume</p>
                <p style={{ color: "#4ADE80", fontSize: "14px", fontWeight: "600", marginTop: "3px" }}>
                  Open File →
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Analysis Placeholder */}
      {resume?.hasResume && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}
        >
          {/* ATS Score */}
          <div style={{ backgroundColor: "#111827", border: "1px solid #1F2937", borderRadius: "16px", padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <div style={{ width: "32px", height: "32px", backgroundColor: "rgba(249,115,22,0.1)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <TrendingUp size={16} color="#F97316" />
              </div>
              <h3 style={{ color: "white", fontSize: "15px", fontWeight: "600" }}>ATS Score</h3>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <div style={{ position: "relative", width: "80px", height: "80px" }}>
                <svg width="80" height="80" style={{ transform: "rotate(-90deg)" }}>
                  <circle cx="40" cy="40" r="32" fill="none" stroke="#1F2937" strokeWidth="8" />
                  <motion.circle
                    cx="40" cy="40" r="32"
                    fill="none"
                    stroke="#F97316"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 32}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 32 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 32 * (1 - 0 / 100) }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: "white", fontSize: "16px", fontWeight: "700" }}>--</span>
                </div>
              </div>
              <div>
                <p style={{ color: "#6B7280", fontSize: "13px", lineHeight: "1.6" }}>
                  ATS score will be available after AI analysis. Click the button below to analyze your resume.
                </p>
              </div>
            </div>
          </div>

          {/* Missing Skills */}
          <div style={{ backgroundColor: "#111827", border: "1px solid #1F2937", borderRadius: "16px", padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <div style={{ width: "32px", height: "32px", backgroundColor: "rgba(239,68,68,0.1)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <AlertCircle size={16} color="#F87171" />
              </div>
              <h3 style={{ color: "white", fontSize: "15px", fontWeight: "600" }}>Missing Skills</h3>
            </div>
            <p style={{ color: "#6B7280", fontSize: "13px", lineHeight: "1.6" }}>
              Missing skills analysis will appear here after AI analysis is complete.
            </p>
          </div>
        </motion.div>
      )}

      {/* Analyze Button */}
      {resume?.hasResume && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.97 }}
            style={{ width: "100%", background: "linear-gradient(135deg, #F97316, #EA580C)", color: "white", padding: "14px", borderRadius: "14px", border: "none", fontSize: "15px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", boxShadow: "0 4px 20px rgba(249,115,22,0.3)" }}
          >
            <Zap size={18} />
            Analyze Resume with AI
          </motion.button>
          <p style={{ color: "#4B5563", fontSize: "12px", textAlign: "center", marginTop: "8px" }}>
            AI analysis uses Gemini API — coming in next phase
          </p>
        </motion.div>
      )}

      {/* No Resume State */}
      {!resume?.hasResume && !uploading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ backgroundColor: "#111827", border: "1px solid #1F2937", borderRadius: "16px", padding: "32px", textAlign: "center" }}
        >
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>📄</div>
          <p style={{ color: "white", fontSize: "16px", fontWeight: "600" }}>No resume uploaded yet</p>
          <p style={{ color: "#6B7280", fontSize: "13px", marginTop: "6px" }}>
            Upload your resume above to get started with AI analysis
          </p>
        </motion.div>
      )}

    </div>
  );
};

export default Resume;