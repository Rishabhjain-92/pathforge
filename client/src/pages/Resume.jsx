import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
  Upload, FileText, CheckCircle,
  AlertCircle, ExternalLink, TrendingUp,
  Zap, Star, Target, Award, ChevronDown, ChevronUp
} from "lucide-react";

const Resume = () => {
  const { refreshUser } = useAuth();
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
    setAnalysis(null);

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

      fetchResume();
      await refreshUser();

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
      await refreshUser();
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
    <div className="flex flex-col gap-5 relative">
      <div className="fixed top-[100px] right-[100px] w-[300px] h-[300px] bg-orange-500/5 dark:bg-orange-500/10 rounded-full blur-3xl pointer-events-none z-0" />

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
        <h1 className="text-gray-900 dark:text-white text-2xl font-bold">Resume Analysis</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Upload your resume for AI-powered analysis and ATS scoring
        </p>
      </motion.div>

      <AnimatePresence>
        {success && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="relative z-10 flex items-center gap-2.5 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 text-green-600 dark:text-green-400 px-4 py-3 rounded-xl text-sm">
            <CheckCircle size={16} />{success}
          </motion.div>
        )}
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="relative z-10 flex items-center gap-2.5 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
            <AlertCircle size={16} />{error}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative z-10">
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className={`group border-2 border-dashed rounded-2xl py-10 px-6 text-center cursor-pointer transition-all duration-300 ${
            dragOver
              ? "border-orange-500 bg-orange-50 dark:bg-orange-500/8 scale-[1.01]"
              : "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-orange-500 hover:bg-orange-50/30 dark:hover:bg-orange-500/5"
          }`}
        >
          <input ref={fileRef} type="file" accept=".pdf,.docx" className="hidden"
            onChange={(e) => handleUpload(e.target.files[0])} />

          {uploading ? (
            <div className="flex flex-col items-center gap-4">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full" />
              <p className="text-orange-500 text-base font-semibold">Uploading & Extracting Skills...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-orange-50 dark:bg-orange-500/10 group-hover:bg-orange-500/15 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-orange-500/20">
                <Upload size={26} className="text-orange-500 transition-transform duration-300 group-hover:-translate-y-0.5" />
              </div>
              <div>
                <p className="text-gray-900 dark:text-white text-lg font-semibold group-hover:text-orange-500 transition-colors duration-300">
                  {resume?.hasResume ? "Upload New Resume" : "Drop your resume here"}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  or <span className="text-orange-500 underline underline-offset-2">click to browse</span>
                </p>
              </div>
              <p className="text-gray-400 dark:text-gray-500 text-xs">PDF and DOCX • Max 5MB</p>
            </div>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {resume?.hasResume && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {[
              { icon: FileText, label: "Resume File", value: resume.fileName, colorClass: "text-orange-500", bgClass: "bg-orange-50 dark:bg-orange-500/10" },
              { icon: CheckCircle, label: "Uploaded On", value: formatDate(resume.uploadedAt), colorClass: "text-blue-500", bgClass: "bg-blue-50 dark:bg-blue-500/10" },
              { icon: ExternalLink, label: "View Resume", value: "Open File →", colorClass: "text-green-500", bgClass: "bg-green-50 dark:bg-green-500/10", onClick: () => window.open(resume.url, "_blank") },
            ].map((card) => (
              <motion.div key={card.label} whileHover={{ scale: 1.02, y: -2 }} onClick={card.onClick}
                className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4.5 flex items-center gap-3.5 ${card.onClick ? 'cursor-pointer hover:border-orange-200 dark:hover:border-gray-700' : ''}`}>
                <div className={`w-11 h-11 ${card.bgClass} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <card.icon size={20} className={card.colorClass} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-500 dark:text-gray-400 text-xs">{card.label}</p>
                  <p className={`${card.onClick ? card.colorClass : "text-gray-900 dark:text-white"} text-sm font-semibold mt-1 truncate`}>
                    {card.value}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {resume?.hasResume && !analysis && (
        <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}
          onClick={handleAnalyze} disabled={analyzing}
          className="relative z-10 w-full bg-gradient-to-br from-orange-500 to-orange-600 text-white p-3.5 rounded-2xl text-base font-semibold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30">
          {analyzing ? (
            <>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
              Analyzing with AI...
            </>
          ) : <><Zap size={18} />Analyze Resume with AI</>}
        </motion.button>
      )}

      <AnimatePresence>
        {analysis && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="relative z-10 flex flex-col gap-4">

            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-3.5">
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                <p className="text-gray-500 dark:text-gray-400 text-xs mb-4">ATS Score</p>
                <div className="relative w-[100px] h-[100px]">
                  <svg width="100" height="100" className="-rotate-90">
                    <circle cx="50" cy="50" r="36" fill="none" className="stroke-gray-100 dark:stroke-gray-800" strokeWidth="8" />
                    <motion.circle cx="50" cy="50" r="36" fill="none" stroke={scoreColor} strokeWidth="8" strokeLinecap="round"
                      strokeDasharray={circumference}
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset: circumference - (analysis.atsScore / 100) * circumference }}
                      transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }} />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                      className="text-[22px] font-extrabold leading-none" style={{ color: scoreColor }}>
                      {analysis.atsScore}
                    </motion.span>
                    <span className="text-gray-500 dark:text-gray-400 text-[11px]">/100</span>
                  </div>
                </div>
                <div className="mt-3.5 px-3 py-1 rounded-full text-[11px] font-bold" style={{ backgroundColor: verdictStyle.bg, border: `1px solid ${verdictStyle.border}`, color: verdictStyle.color }}>
                  {analysis.verdict}
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">{analysis.experienceLevel}</p>
              </div>

              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 bg-orange-50 dark:bg-orange-500/10 rounded-lg flex items-center justify-center">
                    <Star size={14} className="text-orange-500" />
                  </div>
                  <h3 className="text-gray-900 dark:text-white text-sm font-semibold">AI Summary</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4">{analysis.summary}</p>

                {analysis.scoreBreakdown && (
                  <div>
                    <button onClick={() => setShowBreakdown(!showBreakdown)}
                      className="flex items-center gap-1.5 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 text-orange-600 dark:text-orange-500 px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer">
                      {showBreakdown ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      Score Breakdown
                    </button>
                    <AnimatePresence>
                      {showBreakdown && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden mt-3">
                          <div className="flex flex-col gap-2">
                            {Object.entries(analysis.scoreBreakdown).map(([key, val]) => {
                              const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
                              const pct = (val / 20) * 100;
                              const col = pct >= 75 ? "#4ADE80" : pct >= 50 ? "#FB923C" : "#F87171";
                              return (
                                <div key={key}>
                                  <div className="flex justify-between mb-1">
                                    <span className="text-gray-500 dark:text-gray-400 text-xs">{label}</span>
                                    <span className="text-xs font-semibold" style={{ color: col }}>{val}/20</span>
                                  </div>
                                  <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }}
                                      className="h-full rounded-full" style={{ backgroundColor: col }} />
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3.5">
                  <div className="w-7 h-7 bg-green-50 dark:bg-green-500/10 rounded-lg flex items-center justify-center">
                    <TrendingUp size={14} className="text-green-500" />
                  </div>
                  <h3 className="text-gray-900 dark:text-white text-sm font-semibold">Top Skills Found</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysis.topSkills?.map((skill, i) => (
                    <motion.span key={skill} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                      className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-xs font-medium">
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3.5">
                  <div className="w-7 h-7 bg-red-50 dark:bg-red-500/10 rounded-lg flex items-center justify-center">
                    <AlertCircle size={14} className="text-red-500" />
                  </div>
                  <h3 className="text-gray-900 dark:text-white text-sm font-semibold">Missing Skills</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysis.missingSkills?.map((skill, i) => (
                    <motion.span key={skill} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                      className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 px-3 py-1 rounded-full text-xs font-medium">
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3.5">
                  <div className="w-7 h-7 bg-blue-50 dark:bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Award size={14} className="text-blue-500" />
                  </div>
                  <h3 className="text-gray-900 dark:text-white text-sm font-semibold">Strengths</h3>
                </div>
                <div className="flex flex-col gap-2">
                  {analysis.strengths?.map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                      className="flex items-start gap-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2.5">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                      <p className="text-gray-700 dark:text-gray-300 text-xs leading-relaxed">{s}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3.5">
                  <div className="w-7 h-7 bg-yellow-50 dark:bg-yellow-500/10 rounded-lg flex items-center justify-center">
                    <Target size={14} className="text-yellow-500" />
                  </div>
                  <h3 className="text-gray-900 dark:text-white text-sm font-semibold">Improvements</h3>
                </div>
                <div className="flex flex-col gap-2">
                  {analysis.improvements?.map((imp, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                      className="flex items-start gap-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2.5">
                      <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1.5 flex-shrink-0" />
                      <p className="text-gray-700 dark:text-gray-300 text-xs leading-relaxed">{imp}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {analysis.keywords?.length > 0 && (
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3.5">
                  <div className="w-7 h-7 bg-purple-50 dark:bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <Zap size={14} className="text-purple-500" />
                  </div>
                  <h3 className="text-gray-900 dark:text-white text-sm font-semibold">Missing ATS Keywords</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysis.keywords.map((kw, i) => (
                    <motion.span key={kw} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                      className="bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30 text-purple-600 dark:text-purple-400 px-3 py-1 rounded-full text-xs">
                      {kw}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}

            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}
              onClick={handleAnalyze} disabled={analyzing}
              className="w-full bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 text-orange-600 dark:text-orange-500 p-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors hover:bg-orange-100 dark:hover:bg-orange-500/20">
              {analyzing ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4.5 h-4.5 border-2 border-orange-500/30 border-t-orange-500 rounded-full" />
              ) : <Zap size={16} />}
              {analyzing ? "Re-analyzing..." : "Re-analyze Resume"}
            </motion.button>

          </motion.div>
        )}
      </AnimatePresence>

      {!resume?.hasResume && !uploading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="relative z-10 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 text-center shadow-sm dark:shadow-none">
          <div className="text-5xl mb-3">📄</div>
          <p className="text-gray-900 dark:text-white text-base font-semibold">No resume uploaded yet</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1.5">
            Upload your resume above to get started with AI analysis
          </p>
        </motion.div>
      )}

    </div>
  );
};

export default Resume;