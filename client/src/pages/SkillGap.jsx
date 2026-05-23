import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Target, CheckCircle, XCircle,
  TrendingUp, ArrowRight, Zap,
  BookOpen, AlertCircle
} from "lucide-react";

const SkillGap = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchSkillGap();
  }, []);

  const fetchSkillGap = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:5000/api/skill-gap",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData(res.data.data);
    } catch (err) {
      setError("Failed to load skill gap data");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "#4ADE80";
    if (score >= 60) return "#FB923C";
    if (score >= 40) return "#FBBF24";
    return "#F87171";
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return { text: "Strong Match", color: "#4ADE80", bg: "rgba(74,222,128,0.1)", border: "rgba(74,222,128,0.3)" };
    if (score >= 60) return { text: "Good Progress", color: "#FB923C", bg: "rgba(251,146,60,0.1)", border: "rgba(251,146,60,0.3)" };
    if (score >= 40) return { text: "Needs Work", color: "#FBBF24", bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.3)" };
    return { text: "Just Starting", color: "#F87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.3)" };
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{ width: "28px", height: "28px", border: "2px solid rgba(249,115,22,0.3)", borderTop: "2px solid #F97316", borderRadius: "50%" }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", gap: "16px" }}>
        <AlertCircle size={40} color="#F87171" />
        <p style={{ color: "#F87171", fontSize: "16px" }}>{error}</p>
        <button onClick={fetchSkillGap} style={{ backgroundColor: "#F97316", color: "white", padding: "10px 20px", borderRadius: "10px", border: "none", cursor: "pointer", fontSize: "14px" }}>
          Retry
        </button>
      </div>
    );
  }

  if (!data) return null;

  const scoreColor = getScoreColor(data.readinessScore);
  const scoreLabel = getScoreLabel(data.readinessScore);
  const circumference = 2 * Math.PI * 52;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", position: "relative" }}>

      {/* Background glow */}
      <div style={{ position: "fixed", top: "150px", right: "150px", width: "300px", height: "300px", background: "radial-gradient(circle, rgba(249,115,22,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ color: "white", fontSize: "22px", fontWeight: "700" }}>Skill Gap Analysis</h1>
        <p style={{ color: "#6B7280", fontSize: "14px", marginTop: "4px" }}>
          Compare your skills with {data.targetRole} requirements
          {data.targetCompany && ` at ${data.targetCompany}`}
        </p>
      </motion.div>

      {/* Top Row — Score + Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "16px" }}>

        {/* Readiness Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          style={{ backgroundColor: "#111827", border: "1px solid #1F2937", borderRadius: "20px", padding: "28px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}
        >
          <p style={{ color: "#9CA3AF", fontSize: "12px", marginBottom: "20px", fontWeight: "500" }}>
            Readiness Score
          </p>

          {/* Big Circle */}
          <div style={{ position: "relative", width: "130px", height: "130px" }}>
            <svg width="130" height="130" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="65" cy="65" r="52" fill="none" stroke="#1F2937" strokeWidth="10" />
              <motion.circle
                cx="65" cy="65" r="52"
                fill="none"
                stroke={scoreColor}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: circumference - (data.readinessScore / 100) * circumference }}
                transition={{ duration: 1.8, delay: 0.3, ease: "easeOut" }}
              />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, type: "spring" }}
                style={{ color: scoreColor, fontSize: "32px", fontWeight: "800", lineHeight: 1 }}
              >
                {data.readinessScore}%
              </motion.span>
            </div>
          </div>

          {/* Label */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            style={{ marginTop: "16px", backgroundColor: scoreLabel.bg, border: `1px solid ${scoreLabel.border}`, color: scoreLabel.color, padding: "5px 14px", borderRadius: "999px", fontSize: "12px", fontWeight: "700" }}
          >
            {scoreLabel.text}
          </motion.div>

          <p style={{ color: "#6B7280", fontSize: "12px", marginTop: "10px" }}>
            {data.totalMatched} of {data.totalRequired} skills matched
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: "12px" }}>
          {[
            { label: "Skills You Have", value: data.userSkills.length, color: "#60A5FA", bg: "rgba(96,165,250,0.1)", icon: CheckCircle },
            { label: "Skills Matched", value: data.totalMatched, color: "#4ADE80", bg: "rgba(74,222,128,0.1)", icon: Target },
            { label: "Skills Missing", value: data.missingSkills.length, color: "#F87171", bg: "rgba(248,113,113,0.1)", icon: XCircle },
            { label: "Total Required", value: data.totalRequired, color: "#A78BFA", bg: "rgba(167,139,250,0.1)", icon: TrendingUp },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              whileHover={{ scale: 1.02 }}
              style={{ backgroundColor: "#111827", border: "1px solid #1F2937", borderRadius: "16px", padding: "20px", display: "flex", alignItems: "center", gap: "14px" }}
            >
              <div style={{ width: "44px", height: "44px", backgroundColor: stat.bg, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <stat.icon size={20} color={stat.color} />
              </div>
              <div>
                <p style={{ color: "#9CA3AF", fontSize: "12px" }}>{stat.label}</p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  style={{ color: stat.color, fontSize: "24px", fontWeight: "800", marginTop: "2px" }}
                >
                  {stat.value}
                </motion.p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Skills Comparison */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

        {/* Current Skills */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          style={{ backgroundColor: "#111827", border: "1px solid #1F2937", borderRadius: "20px", padding: "22px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <div style={{ width: "32px", height: "32px", backgroundColor: "rgba(74,222,128,0.1)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CheckCircle size={16} color="#4ADE80" />
            </div>
            <h3 style={{ color: "white", fontSize: "15px", fontWeight: "600" }}>
              Current Skills
            </h3>
            <span style={{ marginLeft: "auto", backgroundColor: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)", color: "#4ADE80", padding: "2px 10px", borderRadius: "999px", fontSize: "12px" }}>
              {data.userSkills.length}
            </span>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {data.userSkills.length === 0 ? (
              <p style={{ color: "#6B7280", fontSize: "13px" }}>
                No skills added yet.{" "}
                <span
                  onClick={() => navigate("/profile")}
                  style={{ color: "#F97316", cursor: "pointer" }}
                >
                  Add skills in Profile →
                </span>
              </p>
            ) : (
              data.userSkills.map((skill, i) => {
                const isMatched = data.matchedSkills
                  .map(s => s.toLowerCase())
                  .includes(skill.toLowerCase());
                return (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    style={{
                      backgroundColor: isMatched ? "rgba(74,222,128,0.1)" : "rgba(107,114,128,0.1)",
                      border: `1px solid ${isMatched ? "rgba(74,222,128,0.3)" : "rgba(107,114,128,0.3)"}`,
                      color: isMatched ? "#4ADE80" : "#9CA3AF",
                      padding: "5px 12px",
                      borderRadius: "999px",
                      fontSize: "12px",
                      fontWeight: "500",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px"
                    }}
                  >
                    {isMatched && <CheckCircle size={11} />}
                    {skill}
                  </motion.span>
                );
              })
            )}
          </div>
        </motion.div>

        {/* Required Skills */}
        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
          style={{ backgroundColor: "#111827", border: "1px solid #1F2937", borderRadius: "20px", padding: "22px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <div style={{ width: "32px", height: "32px", backgroundColor: "rgba(249,115,22,0.1)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Target size={16} color="#F97316" />
            </div>
            <h3 style={{ color: "white", fontSize: "15px", fontWeight: "600" }}>
              Required Skills
            </h3>
            <span style={{ marginLeft: "auto", backgroundColor: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)", color: "#F97316", padding: "2px 10px", borderRadius: "999px", fontSize: "12px" }}>
              {data.totalRequired}
            </span>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {data.requiredSkills.map((skill, i) => {
              const isMatched = data.matchedSkills
                .map(s => s.toLowerCase())
                .includes(skill.toLowerCase());
              return (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.45 + i * 0.04 }}
                  style={{
                    backgroundColor: isMatched ? "rgba(74,222,128,0.1)" : "rgba(248,113,113,0.08)",
                    border: `1px solid ${isMatched ? "rgba(74,222,128,0.3)" : "rgba(248,113,113,0.25)"}`,
                    color: isMatched ? "#4ADE80" : "#F87171",
                    padding: "5px 12px",
                    borderRadius: "999px",
                    fontSize: "12px",
                    fontWeight: "500",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px"
                  }}
                >
                  {isMatched ? <CheckCircle size={11} /> : <XCircle size={11} />}
                  {skill}
                </motion.span>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Missing Skills — Priority List */}
      {data.missingSkills.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{ backgroundColor: "#111827", border: "1px solid #1F2937", borderRadius: "20px", padding: "22px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
            <div style={{ width: "32px", height: "32px", backgroundColor: "rgba(248,113,113,0.1)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <XCircle size={16} color="#F87171" />
            </div>
            <h3 style={{ color: "white", fontSize: "15px", fontWeight: "600" }}>
              Skills to Learn
            </h3>
            <span style={{ color: "#6B7280", fontSize: "13px", marginLeft: "4px" }}>
              — Priority order
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "10px" }}>
            {data.missingSkills.map((skill, i) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 + i * 0.06 }}
                whileHover={{ x: 4 }}
                style={{ display: "flex", alignItems: "center", gap: "12px", backgroundColor: "#1F2937", borderRadius: "12px", padding: "12px 14px" }}
              >
                <div style={{ width: "24px", height: "24px", backgroundColor: "rgba(248,113,113,0.15)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ color: "#F87171", fontSize: "11px", fontWeight: "700" }}>
                    {i + 1}
                  </span>
                </div>
                <span style={{ color: "#D1D5DB", fontSize: "13px", fontWeight: "500" }}>{skill}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Progress Bar — Visual */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        style={{ backgroundColor: "#111827", border: "1px solid #1F2937", borderRadius: "20px", padding: "22px" }}
      >
        <h3 style={{ color: "white", fontSize: "15px", fontWeight: "600", marginBottom: "16px" }}>
          Skill Match Visualization
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {data.requiredSkills.map((skill, i) => {
            const isMatched = data.matchedSkills
              .map(s => s.toLowerCase())
              .includes(skill.toLowerCase());
            return (
              <div key={skill}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                  <span style={{ color: isMatched ? "#D1D5DB" : "#6B7280", fontSize: "12px" }}>
                    {skill}
                  </span>
                  <span style={{ color: isMatched ? "#4ADE80" : "#F87171", fontSize: "12px", fontWeight: "600" }}>
                    {isMatched ? "✓ Matched" : "✗ Missing"}
                  </span>
                </div>
                <div style={{ width: "100%", height: "5px", backgroundColor: "#1F2937", borderRadius: "999px", overflow: "hidden" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: isMatched ? "100%" : "0%" }}
                    transition={{ duration: 0.8, delay: 0.7 + i * 0.04 }}
                    style={{ height: "100%", backgroundColor: isMatched ? "#4ADE80" : "#F87171", borderRadius: "999px" }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}
      >
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/roadmap")}
          style={{ backgroundColor: "#F97316", color: "white", padding: "14px", borderRadius: "14px", border: "none", fontSize: "14px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", boxShadow: "0 4px 20px rgba(249,115,22,0.25)" }}
        >
          <Zap size={16} />
          Generate Roadmap to Fill Gaps
          <ArrowRight size={16} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/profile")}
          style={{ backgroundColor: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.3)", color: "#F97316", padding: "14px", borderRadius: "14px", fontSize: "14px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
        >
          <BookOpen size={16} />
          Update My Skills
        </motion.button>
      </motion.div>

    </div>
  );
};

export default SkillGap;