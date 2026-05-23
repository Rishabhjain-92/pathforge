import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext"; // ✅ import add karo
import {
  Upload, FileText, CheckCircle,
  AlertCircle, ExternalLink, TrendingUp,
  Zap, Star, Target, Award, ChevronDown, ChevronUp
} from "lucide-react";

const Resume = () => {
  const { refreshUser } = useAuth(); // ✅ component ke andar
  const [resume, setResume] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showBreakdown, setShowBreakdown] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    fetchResume();
    fetchAnalysis();
  }, []);

  const getToken = () => localStorage.getItem("token");

  const fetchResume = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/resume",
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setResume(res.data.resume);
    } catch (error) {
      console.error("Failed to fetch resume");
    }
  };

  const fetchAnalysis = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/ai/analysis",
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      if (res.data.analysis) setAnalysis(res.data.analysis);
    } catch (error) {
      console.error("Failed to fetch analysis");
    }
  };

  const handleUpload = async (file) => {
    if (!file) return;

    const allowed = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

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
    setSuccess("");
    setAnalysis(null); // ✅ purana analysis clear karo

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const uploadRes = await axios.post(
        "http://localhost:5000/api/resume/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccess(`Resume uploaded! ${uploadRes.data.totalSkillsFound || 0} skills extracted.`);
      setTimeout(() => setSuccess(""), 4000);

      fetchResume();          // ✅ resume info refresh
      await refreshUser();    // ✅ skills + context + localStorage sab update

    } catch (err) {
      setError(err.response?.data?.message || "Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setError("");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/ai/analyze-resume",
        {},
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setAnalysis(res.data.analysis);
      setSuccess("AI analysis complete!");
      setTimeout(() => setSuccess(""), 3000);
      await refreshUser(); // ✅ readinessScore dashboard pe update hoga
    } catch (err) {
      setError(err.response?.data?.message || "Analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleUpload(e.dataTransfer.files[0]);
  };

  const formatDate = (date) => {
    if (!date) return "Unknown";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric"
    });
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "#4ADE80";
    if (score >= 60) return "#FB923C";
    if (score >= 40) return "#FBBF24";
    return "#F87171";
  };

  const getVerdictStyle = (verdict) => {
    if (!verdict) return { bg: "rgba(107,114,128,0.1)", border: "rgba(107,114,128,0.3)", color: "#9CA3AF" };
    if (verdict.includes("STRONG")) return { bg: "rgba(74,222,128,0.1)", border: "rgba(74,222,128,0.3)", color: "#4ADE80" };
    if (verdict.includes("PASS")) return { bg: "rgba(96,165,250,0.1)", border: "rgba(96,165,250,0.3)", color: "#60A5FA" };
    if (verdict.includes("BORDERLINE")) return { bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.3)", color: "#FBBF24" };
    return { bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.3)", color: "#F87171" };
  };

  const scoreColor = analysis ? getScoreColor(analysis.atsScore) : "#6B7280";
  const verdictStyle = getVerdictStyle(analysis?.verdict);
  const circumference = 2 * Math.PI * 36;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", position: "relative" }}>

      <div style={{ position: "fixed", top: "100px", right: "100px", width: "300px", height: "300px", background: "radial-gradient(circle, rgba(249,115,22,0.05) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ color: "white", fontSize: "22px", fontWeight: "700" }}>Resume Analysis</h1>
        <p style={{ color: "#6B7280", fontSize: "14px", marginTop: "4px" }}>
          Upload your resume for AI-powered analysis and ATS scoring
        </p>
      </motion.div>

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ display: "flex", alignItems: "center", gap: "10px", backgroundColor: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", color: "#4ADE80", padding: "12px 16px", borderRadius: "12px", fontSize: "14px" }}
          >
            <CheckCircle size={16} />{success}
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ display: "flex", alignItems: "center", gap: "10px", backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#F87171", padding: "12px 16px", borderRadius: "12px", fontSize: "14px" }}
          >
            <AlertCircle size={16} />{error}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          style={{
            border: `2px dashed ${dragOver ? "#F97316" : "#374151"}`,
            borderRadius: "20px",
            padding: "40px 24px",
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
              <p style={{ color: "#F97316", fontSize: "16px", fontWeight: "600" }}>Uploading & Extracting Skills...</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ width: "60px", height: "60px", backgroundColor: "rgba(249,115,22,0.1)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <Upload size={26} color="#F97316" />
              </motion.div>
              <div>
                <p style={{ color: "white", fontSize: "17px", fontWeight: "600" }}>
                  {resume?.hasResume ? "Upload New Resume" : "Drop your resume here"}
                </p>
                <p style={{ color: "#6B7280", fontSize: "13px", marginTop: "4px" }}>
                  or <span style={{ color: "#F97316" }}>click to browse</span>
                </p>
              </div>
              <p style={{ color: "#4B5563", fontSize: "12px" }}>PDF and DOCX • Max 5MB</p>
            </div>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {resume?.hasResume && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px" }}
          >
            {[
              { icon: FileText, label: "Resume File", value: resume.fileName, color: "#F97316", bg: "rgba(249,115,22,0.1)" },
              { icon: CheckCircle, label: "Uploaded On", value: formatDate(resume.uploadedAt), color: "#60A5FA", bg: "rgba(96,165,250,0.1)" },
              { icon: ExternalLink, label: "View Resume", value: "Open File →", color: "#4ADE80", bg: "rgba(74,222,128,0.1)", onClick: () => window.open(resume.url, "_blank") },
            ].map((card) => (
              <motion.div
                key={card.label}
                whileHover={{ scale: 1.02, y: -2 }}
                onClick={card.onClick}
                style={{ backgroundColor: "#111827", border: "1px solid #1F2937", borderRadius: "16px", padding: "18px", display: "flex", alignItems: "center", gap: "14px", cursor: card.onClick ? "pointer" : "default" }}
              >
                <div style={{ width: "44px", height: "44px", backgroundColor: card.bg, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <card.icon size={20} color={card.color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: "#9CA3AF", fontSize: "12px" }}>{card.label}</p>
                  <p style={{ color: card.onClick ? card.color : "white", fontSize: "13px", fontWeight: "600", marginTop: "3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {card.value}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {resume?.hasResume && !analysis && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleAnalyze}
          disabled={analyzing}
          style={{ width: "100%", background: "linear-gradient(135deg, #F97316, #EA580C)", color: "white", padding: "14px", borderRadius: "14px", border: "none", fontSize: "15px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", boxShadow: "0 4px 20px rgba(249,115,22,0.3)" }}
        >
          {analyzing ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{ width: "20px", height: "20px", border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid white", borderRadius: "50%" }}
              />
              Analyzing with AI...
            </>
          ) : (
            <><Zap size={18} />Analyze Resume with AI</>
          )}
        </motion.button>
      )}

      <AnimatePresence>
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "14px" }}>
              <div style={{ backgroundColor: "#111827", border: "1px solid #1F2937", borderRadius: "20px", padding: "24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                <p style={{ color: "#9CA3AF", fontSize: "12px", marginBottom: "16px" }}>ATS Score</p>
                <div style={{ position: "relative", width: "100px", height: "100px" }}>
                  <svg width="100" height="100" style={{ transform: "rotate(-90deg)" }}>
                    <circle cx="50" cy="50" r="36" fill="none" stroke="#1F2937" strokeWidth="8" />
                    <motion.circle
                      cx="50" cy="50" r="36"
                      fill="none"
                      stroke={scoreColor}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset: circumference - (analysis.atsScore / 100) * circumference }}
                      transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
                    />
                  </svg>
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      style={{ color: scoreColor, fontSize: "22px", fontWeight: "800", lineHeight: 1 }}
                    >
                      {analysis.atsScore}
                    </motion.span>
                    <span style={{ color: "#6B7280", fontSize: "11px" }}>/100</span>
                  </div>
                </div>
                <div style={{ marginTop: "14px", backgroundColor: verdictStyle.bg, border: `1px solid ${verdictStyle.border}`, color: verdictStyle.color, padding: "4px 12px", borderRadius: "999px", fontSize: "11px", fontWeight: "700" }}>
                  {analysis.verdict}
                </div>
                <p style={{ color: "#6B7280", fontSize: "12px", marginTop: "8px" }}>{analysis.experienceLevel}</p>
              </div>

              <div style={{ backgroundColor: "#111827", border: "1px solid #1F2937", borderRadius: "20px", padding: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                  <div style={{ width: "28px", height: "28px", backgroundColor: "rgba(249,115,22,0.1)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Star size={14} color="#F97316" />
                  </div>
                  <h3 style={{ color: "white", fontSize: "15px", fontWeight: "600" }}>AI Summary</h3>
                </div>
                <p style={{ color: "#D1D5DB", fontSize: "14px", lineHeight: "1.7", marginBottom: "16px" }}>
                  {analysis.summary}
                </p>

                {analysis.scoreBreakdown && (
                  <div>
                    <button
                      onClick={() => setShowBreakdown(!showBreakdown)}
                      style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)", color: "#F97316", padding: "6px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
                    >
                      {showBreakdown ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      Score Breakdown
                    </button>
                    <AnimatePresence>
                      {showBreakdown && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          style={{ overflow: "hidden", marginTop: "12px" }}
                        >
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            {Object.entries(analysis.scoreBreakdown).map(([key, val]) => {
                              const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
                              const pct = (val / 20) * 100;
                              const col = pct >= 75 ? "#4ADE80" : pct >= 50 ? "#FB923C" : "#F87171";
                              return (
                                <div key={key}>
                                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                                    <span style={{ color: "#9CA3AF", fontSize: "12px" }}>{label}</span>
                                    <span style={{ color: col, fontSize: "12px", fontWeight: "600" }}>{val}/20</span>
                                  </div>
                                  <div style={{ width: "100%", height: "5px", backgroundColor: "#1F2937", borderRadius: "999px", overflow: "hidden" }}>
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${pct}%` }}
                                      transition={{ duration: 0.8 }}
                                      style={{ height: "100%", backgroundColor: col, borderRadius: "999px" }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <div style={{ backgroundColor: "#111827", border: "1px solid #1F2937", borderRadius: "20px", padding: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                  <div style={{ width: "28px", height: "28px", backgroundColor: "rgba(74,222,128,0.1)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <TrendingUp size={14} color="#4ADE80" />
                  </div>
                  <h3 style={{ color: "white", fontSize: "14px", fontWeight: "600" }}>Top Skills Found</h3>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {analysis.topSkills?.map((skill, i) => (
                    <motion.span key={skill} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                      style={{ backgroundColor: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)", color: "#4ADE80", padding: "5px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: "500" }}>
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>

              <div style={{ backgroundColor: "#111827", border: "1px solid #1F2937", borderRadius: "20px", padding: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                  <div style={{ width: "28px", height: "28px", backgroundColor: "rgba(248,113,113,0.1)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <AlertCircle size={14} color="#F87171" />
                  </div>
                  <h3 style={{ color: "white", fontSize: "14px", fontWeight: "600" }}>Missing Skills</h3>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {analysis.missingSkills?.map((skill, i) => (
                    <motion.span key={skill} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                      style={{ backgroundColor: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", color: "#F87171", padding: "5px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: "500" }}>
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <div style={{ backgroundColor: "#111827", border: "1px solid #1F2937", borderRadius: "20px", padding: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                  <div style={{ width: "28px", height: "28px", backgroundColor: "rgba(96,165,250,0.1)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Award size={14} color="#60A5FA" />
                  </div>
                  <h3 style={{ color: "white", fontSize: "14px", fontWeight: "600" }}>Strengths</h3>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {analysis.strengths?.map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                      style={{ display: "flex", alignItems: "flex-start", gap: "10px", backgroundColor: "#1F2937", borderRadius: "10px", padding: "10px 12px" }}>
                      <div style={{ width: "6px", height: "6px", backgroundColor: "#60A5FA", borderRadius: "50%", marginTop: "6px", flexShrink: 0 }} />
                      <p style={{ color: "#D1D5DB", fontSize: "13px", lineHeight: "1.5" }}>{s}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div style={{ backgroundColor: "#111827", border: "1px solid #1F2937", borderRadius: "20px", padding: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                  <div style={{ width: "28px", height: "28px", backgroundColor: "rgba(251,191,36,0.1)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Target size={14} color="#FBBF24" />
                  </div>
                  <h3 style={{ color: "white", fontSize: "14px", fontWeight: "600" }}>Improvements</h3>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {analysis.improvements?.map((imp, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                      style={{ display: "flex", alignItems: "flex-start", gap: "10px", backgroundColor: "#1F2937", borderRadius: "10px", padding: "10px 12px" }}>
                      <div style={{ width: "6px", height: "6px", backgroundColor: "#FBBF24", borderRadius: "50%", marginTop: "6px", flexShrink: 0 }} />
                      <p style={{ color: "#D1D5DB", fontSize: "13px", lineHeight: "1.5" }}>{imp}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {analysis.keywords?.length > 0 && (
              <div style={{ backgroundColor: "#111827", border: "1px solid #1F2937", borderRadius: "20px", padding: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                  <div style={{ width: "28px", height: "28px", backgroundColor: "rgba(167,139,250,0.1)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Zap size={14} color="#A78BFA" />
                  </div>
                  <h3 style={{ color: "white", fontSize: "14px", fontWeight: "600" }}>Missing ATS Keywords</h3>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {analysis.keywords.map((kw, i) => (
                    <motion.span key={kw} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                      style={{ backgroundColor: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.3)", color: "#A78BFA", padding: "5px 12px", borderRadius: "999px", fontSize: "12px" }}>
                      {kw}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleAnalyze}
              disabled={analyzing}
              style={{ width: "100%", backgroundColor: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.3)", color: "#F97316", padding: "12px", borderRadius: "14px", fontSize: "14px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
            >
              {analyzing ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  style={{ width: "18px", height: "18px", border: "2px solid rgba(249,115,22,0.3)", borderTop: "2px solid #F97316", borderRadius: "50%" }} />
              ) : <Zap size={16} />}
              {analyzing ? "Re-analyzing..." : "Re-analyze Resume"}
            </motion.button>

          </motion.div>
        )}
      </AnimatePresence>

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