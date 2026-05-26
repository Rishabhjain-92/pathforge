import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Zap, ArrowRight, CheckCircle, Circle,
  Target, BookOpen, Code, Users,
  ChevronDown, ChevronUp, Trophy, TrendingUp,
  AlertTriangle, RefreshCw
} from "lucide-react";

const categoryConfig = {
  DSA: { color: "#60A5FA", bg: "rgba(96,165,250,0.1)", border: "rgba(96,165,250,0.3)" },
  Project: { color: "#4ADE80", bg: "rgba(74,222,128,0.1)", border: "rgba(74,222,128,0.3)" },
  Learning: { color: "#F97316", bg: "rgba(249,115,22,0.1)", border: "rgba(249,115,22,0.3)" },
  Interview: { color: "#A78BFA", bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.3)" },
};

const difficultyConfig = {
  easy: { color: "#4ADE80", bg: "rgba(74,222,128,0.1)", label: "Easy" },
  medium: { color: "#FBBF24", bg: "rgba(251,191,36,0.1)", label: "Medium" },
  hard: { color: "#F87171", bg: "rgba(248,113,113,0.1)", label: "Hard" },
};

const categoryIcon = {
  DSA: Code,
  Project: Target,
  Learning: BookOpen,
  Interview: Users,
};

const Roadmap = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [expandedMonths, setExpandedMonths] = useState(new Set([0]));
  const [progress, setProgress] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const getToken = () => localStorage.getItem("token");

  const fetchRoadmap = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/roadmap",
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      if (res.data.roadmap) {
        setRoadmap(res.data.roadmap);
        calculateProgress(res.data.roadmap);
      }
    } catch (err) {
      console.error("Failed to fetch roadmap");
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (roadmapData) => {
    try {
      if (!roadmapData?.months || !Array.isArray(roadmapData.months)) return;
      const total = roadmapData.months.reduce(
        (sum, month) => sum + (month.tasks?.length || 0), 0
      );
      const completed = roadmapData.months.reduce(
        (sum, month) => sum + (month.tasks?.filter(t => t.completed)?.length || 0), 0
      );
      setTotalTasks(total);
      setCompletedTasks(completed);
      setProgress(total > 0 ? Math.round((completed / total) * 100) : 0);
    } catch (err) {
      console.error("Error calculating progress:", err);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setError("");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/roadmap/generate",
        {},
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setRoadmap(res.data.roadmap);
      calculateProgress(res.data.roadmap);
      setExpandedMonths(new Set([0]));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate roadmap. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleTaskToggle = async (monthIndex, taskIndex, currentCompleted) => {
    try {
      const res = await axios.put(
        "http://localhost:5000/api/roadmap/task",
        {
          monthIndex,
          taskIndex,
          completed: !currentCompleted
        },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );

      // Update local state
      const updatedRoadmap = { ...roadmap };
      updatedRoadmap.months = updatedRoadmap.months.map((m, mi) => {
        if (mi !== monthIndex) return m;
        return {
          ...m,
          tasks: m.tasks.map((t, ti) => {
            if (ti !== taskIndex) return t;
            return { ...t, completed: !currentCompleted };
          })
        };
      });
      setRoadmap(updatedRoadmap);
      setProgress(res.data.progress);
      setCompletedTasks(res.data.completedTasks);
      setTotalTasks(res.data.totalTasks);

    } catch (err) {
      setError("Failed to update task. Please try again.");
      setTimeout(() => setError(""), 3000);
    }
  };

  const toggleMonth = (monthIndex) => {
    setExpandedMonths(prev => {
      const next = new Set(prev);
      if (next.has(monthIndex)) {
        next.delete(monthIndex);
      } else {
        next.add(monthIndex);
      }
      return next;
    });
  };

  const getMonthStatus = (month) => {
    const total = month.tasks?.length || 0;
    const completed = month.tasks?.filter(t => t.completed)?.length || 0;
    if (total > 0 && completed === total) return "completed";
    if (completed > 0) return "inProgress";
    return "upcoming";
  };

  const getMonthProgress = (month) => {
    const total = month.tasks?.length || 0;
    const completed = month.tasks?.filter(t => t.completed)?.length || 0;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const monthStatusConfig = {
    completed: { color: "#4ADE80", bg: "rgba(74,222,128,0.1)", border: "rgba(74,222,128,0.3)", label: "Completed" },
    inProgress: { color: "#F97316", bg: "rgba(249,115,22,0.1)", border: "rgba(249,115,22,0.3)", label: "In Progress" },
    upcoming: { color: "#6B7280", bg: "rgba(107,114,128,0.1)", border: "rgba(107,114,128,0.3)", label: "Upcoming" },
  };

  const circumference = 2 * Math.PI * 40;

  // Split months into two columns for masonry layout (fixes adjacent card expansion bug)
  const leftColumnMonths = roadmap?.months?.filter((_, i) => i % 2 === 0) || [];
  const rightColumnMonths = roadmap?.months?.filter((_, i) => i % 2 !== 0) || [];

  const renderMonthCard = (month, monthIndex) => {
    const status = getMonthStatus(month);
    const statusStyle = monthStatusConfig[status];
    const isExpanded = expandedMonths.has(monthIndex);
    const monthCompleted = month.tasks?.filter(t => t.completed)?.length || 0;
    const monthProg = getMonthProgress(month);

    return (
      <motion.div
        key={monthIndex}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: monthIndex * 0.05 }}
        style={{
          backgroundColor: "#111827",
          border: `1px solid ${isExpanded ? "rgba(249,115,22,0.3)" : "#1F2937"}`,
          borderRadius: "16px",
          overflow: "hidden",
          transition: "border 0.3s",
        }}
      >
        {/* Month Header */}
        <div
          onClick={() => toggleMonth(monthIndex)}
          style={{ padding: "16px 20px", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px" }}
        >
          {/* Month Number */}
          <div style={{
            width: "36px", height: "36px",
            backgroundColor: statusStyle.bg,
            border: `1px solid ${statusStyle.border}`,
            borderRadius: "10px",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            {status === "completed" ? (
              <CheckCircle size={18} color={statusStyle.color} />
            ) : (
              <span style={{ color: statusStyle.color, fontSize: "13px", fontWeight: "700" }}>
                {monthIndex + 1}
              </span>
            )}
          </div>

          {/* Month Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
              <p style={{ color: "white", fontSize: "13px", fontWeight: "600" }}>
                Month {month.month} — {month.title}
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <p style={{ color: "#6B7280", fontSize: "11px" }}>
                {monthCompleted}/{month.tasks?.length || 0} tasks
              </p>
              <span style={{
                backgroundColor: statusStyle.bg,
                border: `1px solid ${statusStyle.border}`,
                color: statusStyle.color,
                padding: "1px 8px",
                borderRadius: "999px",
                fontSize: "10px",
                fontWeight: "600",
              }}>
                {statusStyle.label}
              </span>
            </div>

            {/* Per-month mini progress bar */}
            <div style={{ width: "100%", height: "3px", backgroundColor: "#1F2937", borderRadius: "999px", overflow: "hidden" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${monthProg}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{
                  height: "100%",
                  background: status === "completed"
                    ? "linear-gradient(to right, #22C55E, #4ADE80)"
                    : "linear-gradient(to right, #EA580C, #FB923C)",
                  borderRadius: "999px",
                }}
              />
            </div>
          </div>

          {/* Expand icon */}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            style={{ color: "#6B7280", flexShrink: 0 }}
          >
            <ChevronDown size={16} />
          </motion.div>
        </div>

        {/* Expanded Content */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
            >
              <div style={{ padding: "0 20px 16px", borderTop: "1px solid #1F2937" }}>

                {/* Goals */}
                {month.goals && month.goals.length > 0 && (
                  <div style={{ marginTop: "14px", marginBottom: "14px" }}>
                    <p style={{ color: "#9CA3AF", fontSize: "11px", fontWeight: "600", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Goals
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                      {month.goals.map((goal, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                          <div style={{ width: "5px", height: "5px", backgroundColor: "#F97316", borderRadius: "50%", marginTop: "6px", flexShrink: 0 }} />
                          <p style={{ color: "#D1D5DB", fontSize: "12px", lineHeight: "1.5" }}>{goal}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tasks */}
                {month.tasks && month.tasks.length > 0 && (
                  <div style={{ marginBottom: "14px" }}>
                    <p style={{ color: "#9CA3AF", fontSize: "11px", fontWeight: "600", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Tasks
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {month.tasks.map((task, taskIndex) => {
                        const catConfig = categoryConfig[task.category] || categoryConfig.Learning;
                        const diffConfig = difficultyConfig[task.difficulty] || null;

                        return (
                          <motion.div
                            key={taskIndex}
                            whileHover={{ x: 3 }}
                            onClick={() => handleTaskToggle(monthIndex, taskIndex, task.completed)}
                            style={{
                              display: "flex", alignItems: "flex-start", gap: "10px",
                              backgroundColor: task.completed ? "rgba(74,222,128,0.05)" : "#1F2937",
                              border: `1px solid ${task.completed ? "rgba(74,222,128,0.2)" : "transparent"}`,
                              borderRadius: "10px",
                              padding: "10px 12px",
                              cursor: "pointer",
                              transition: "all 0.2s",
                            }}
                          >
                            {/* Checkbox */}
                            <div style={{ marginTop: "1px", flexShrink: 0 }}>
                              {task.completed ? (
                                <CheckCircle size={16} color="#4ADE80" />
                              ) : (
                                <Circle size={16} color="#4B5563" />
                              )}
                            </div>

                            {/* Task text */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{
                                color: task.completed ? "#6B7280" : "#D1D5DB",
                                fontSize: "12px",
                                lineHeight: "1.5",
                                textDecoration: task.completed ? "line-through" : "none",
                              }}>
                                {task.task}
                              </p>
                              {task.weekNumber && (
                                <p style={{ color: "#4B5563", fontSize: "10px", marginTop: "2px" }}>
                                  Week {task.weekNumber}
                                </p>
                              )}
                            </div>

                            {/* Badges */}
                            <div style={{ display: "flex", gap: "4px", flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end" }}>
                              {diffConfig && (
                                <span style={{
                                  backgroundColor: diffConfig.bg,
                                  color: diffConfig.color,
                                  padding: "2px 6px",
                                  borderRadius: "999px",
                                  fontSize: "9px",
                                  fontWeight: "600",
                                }}>
                                  {diffConfig.label}
                                </span>
                              )}
                              <span style={{
                                backgroundColor: catConfig.bg,
                                border: `1px solid ${catConfig.border}`,
                                color: catConfig.color,
                                padding: "2px 8px",
                                borderRadius: "999px",
                                fontSize: "10px",
                                fontWeight: "600",
                              }}>
                                {task.category}
                              </span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Milestone */}
                {month.milestone && (
                  <div style={{
                    backgroundColor: "rgba(249,115,22,0.05)",
                    border: "1px solid rgba(249,115,22,0.15)",
                    borderRadius: "10px",
                    padding: "10px 14px",
                  }}>
                    <p style={{ color: "#9CA3AF", fontSize: "10px", marginBottom: "3px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Month Milestone
                    </p>
                    <p style={{ color: "#FB923C", fontSize: "12px", lineHeight: "1.5" }}>
                      🎯 {month.milestone}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Background */}
      <div style={{ position: "fixed", top: "150px", right: "150px", width: "300px", height: "300px", background: "radial-gradient(circle, rgba(249,115,22,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ color: "white", fontSize: "22px", fontWeight: "700" }}>
          Dream Role Reverse Planner
        </h1>
        <p style={{ color: "#6B7280", fontSize: "14px", marginTop: "4px" }}>
          AI-powered roadmap to your dream career
        </p>
      </motion.div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              backgroundColor: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              color: "#F87171",
              padding: "12px 16px",
              borderRadius: "12px",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <AlertTriangle size={16} />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generate / Regenerate Button */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>

        {/* Input Row */}
        <div style={{ backgroundColor: "#111827", border: "1px solid #1F2937", borderRadius: "16px", padding: "20px", marginBottom: "14px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", marginBottom: "16px" }}>
            <div style={{ flex: "1 1 200px", minWidth: "150px" }}>
              <p style={{ color: "#9CA3AF", fontSize: "12px", marginBottom: "6px" }}>Dream Role</p>
              <p style={{ color: "white", fontSize: "14px", fontWeight: "600", backgroundColor: "#1F2937", padding: "10px 14px", borderRadius: "8px" }}>
                {user?.targetRole || "Not set — Update in Profile"}
              </p>
            </div>
            <div style={{ flex: "1 1 200px", minWidth: "150px" }}>
              <p style={{ color: "#9CA3AF", fontSize: "12px", marginBottom: "6px" }}>Dream Company</p>
              <p style={{ color: "white", fontSize: "14px", fontWeight: "600", backgroundColor: "#1F2937", padding: "10px 14px", borderRadius: "8px" }}>
                {user?.targetCompany || "Not set — Update in Profile"}
              </p>
            </div>
            <div style={{ flex: "1 1 140px", minWidth: "120px" }}>
              <p style={{ color: "#9CA3AF", fontSize: "12px", marginBottom: "6px" }}>Timeline</p>
              <p style={{ color: "#F97316", fontSize: "14px", fontWeight: "600", backgroundColor: "#1F2937", padding: "10px 14px", borderRadius: "8px" }}>
                {user?.timeline || 12} months
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleGenerate}
            disabled={generating}
            style={{
              width: "100%",
              background: generating ? "#374151" : "linear-gradient(135deg, #F97316, #EA580C)",
              color: "white",
              padding: "13px",
              borderRadius: "12px",
              border: "none",
              fontSize: "14px",
              fontWeight: "600",
              cursor: generating ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              boxShadow: generating ? "none" : "0 4px 20px rgba(249,115,22,0.25)",
              opacity: generating ? 0.7 : 1,
              transition: "all 0.3s",
            }}
          >
            {generating ? (
              <>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  style={{ width: "18px", height: "18px", border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid white", borderRadius: "50%" }} />
                Generating with AI...
              </>
            ) : (
              <>
                <Zap size={16} />
                {roadmap ? "Regenerate Roadmap with AI" : "Generate Roadmap with AI"}
                <ArrowRight size={16} />
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Roadmap Content */}
      {roadmap && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

          {/* Stats Row — Responsive flex wrap */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "14px" }}>

            {/* Progress Circle */}
            <div style={{
              backgroundColor: "#111827",
              border: "1px solid #1F2937",
              borderRadius: "16px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              flex: "0 0 180px",
              minWidth: "160px",
            }}>
              <p style={{ color: "#9CA3AF", fontSize: "12px", marginBottom: "12px" }}>Progress</p>
              <div style={{ position: "relative", width: "100px", height: "100px" }}>
                <svg width="100" height="100" style={{ transform: "rotate(-90deg)" }}>
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#1F2937" strokeWidth="8" />
                  <motion.circle
                    cx="50" cy="50" r="40"
                    fill="none"
                    stroke="#F97316"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: circumference - (progress / 100) * circumference }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: "#F97316", fontSize: "20px", fontWeight: "800" }}>{progress}%</span>
                </div>
              </div>
              <p style={{ color: "#6B7280", fontSize: "11px", marginTop: "10px" }}>
                {completedTasks}/{totalTasks} tasks
              </p>
            </div>

            {/* Overview + Progress Bar */}
            <div style={{
              backgroundColor: "#111827",
              border: "1px solid #1F2937",
              borderRadius: "16px",
              padding: "20px",
              flex: "1 1 300px",
              minWidth: "250px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                <Trophy size={16} color="#F97316" />
                <h3 style={{ color: "white", fontSize: "14px", fontWeight: "600" }}>{roadmap.title}</h3>
              </div>
              <p style={{ color: "#9CA3AF", fontSize: "13px", lineHeight: "1.6", marginBottom: "16px" }}>
                {roadmap.overview}
              </p>

              {/* Progress Bar */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ color: "#6B7280", fontSize: "12px" }}>Overall Completion</span>
                  <span style={{ color: "#F97316", fontSize: "12px", fontWeight: "600" }}>{progress}%</span>
                </div>
                <div style={{ width: "100%", height: "6px", backgroundColor: "#1F2937", borderRadius: "999px", overflow: "hidden" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    style={{ height: "100%", background: "linear-gradient(to right, #EA580C, #FB923C)", borderRadius: "999px" }}
                  />
                </div>
              </div>

              {/* Key Milestones */}
              {roadmap.keyMilestones && (
                <div style={{ marginTop: "14px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {roadmap.keyMilestones.map((m, i) => (
                    <span key={i} style={{ backgroundColor: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.2)", color: "#FB923C", padding: "3px 10px", borderRadius: "999px", fontSize: "11px" }}>
                      🎯 {m}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Readiness + On Track */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: "0 0 180px", minWidth: "160px" }}>
              <div style={{ backgroundColor: "#111827", border: "1px solid #1F2937", borderRadius: "16px", padding: "16px", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                  <TrendingUp size={14} color="#F97316" />
                  <p style={{ color: "#9CA3AF", fontSize: "12px" }}>Est. Readiness</p>
                </div>
                <p style={{ color: "#F97316", fontSize: "28px", fontWeight: "800" }}>
                  {roadmap.estimatedReadiness}%
                </p>
                <p style={{ color: "#6B7280", fontSize: "11px", marginTop: "4px" }}>After completion</p>
              </div>

              <div style={{ backgroundColor: "#111827", border: "1px solid rgba(74,222,128,0.2)", borderRadius: "16px", padding: "16px", flex: 1 }}>
                <p style={{ color: "#4ADE80", fontSize: "12px", fontWeight: "600", marginBottom: "6px" }}>
                  ↗ On Track
                </p>
                <p style={{ color: "#6B7280", fontSize: "12px", lineHeight: "1.5" }}>
                  Follow this plan consistently to reach your goal in {roadmap.totalMonths} months.
                </p>
              </div>
            </div>
          </div>

          {/* Month Cards — Two separate flex columns (masonry layout) */}
          {/* This fixes the bug where expanding one card caused the adjacent card to grow */}
          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
            {/* Left Column — Even indices (0, 2, 4, ...) */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "12px" }}>
              {leftColumnMonths.map((month, i) => {
                const actualIndex = i * 2; // Map back to actual month index
                return renderMonthCard(month, actualIndex);
              })}
            </div>
            {/* Right Column — Odd indices (1, 3, 5, ...) */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "12px" }}>
              {rightColumnMonths.map((month, i) => {
                const actualIndex = i * 2 + 1; // Map back to actual month index
                return renderMonthCard(month, actualIndex);
              })}
            </div>
          </div>

          {/* CTA Buttons */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/skill-gap")}
              style={{ backgroundColor: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.3)", color: "#F97316", padding: "12px", borderRadius: "12px", fontSize: "13px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
            >
              <Target size={15} />
              View Skill Gap
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/recommendations")}
              style={{ backgroundColor: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)", color: "#4ADE80", padding: "12px", borderRadius: "12px", fontSize: "13px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
            >
              <BookOpen size={15} />
              View Recommendations
            </motion.button>
          </div>

        </motion.div>
      )}

      {/* No Roadmap State — Enhanced */}
      {!roadmap && !generating && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            backgroundColor: "#111827",
            border: "1px solid #1F2937",
            borderRadius: "20px",
            padding: "48px",
            textAlign: "center",
          }}
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{ fontSize: "56px", marginBottom: "16px" }}
          >
            🗺️
          </motion.div>
          <p style={{ color: "white", fontSize: "18px", fontWeight: "700", marginBottom: "8px" }}>No Roadmap Generated Yet</p>
          <p style={{ color: "#6B7280", fontSize: "14px", marginBottom: "24px", maxWidth: "400px", margin: "0 auto 24px" }}>
            Generate your personalized AI roadmap based on your target role and company
          </p>
          {!user?.targetRole && (
            <div style={{
              backgroundColor: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: "12px",
              padding: "14px 20px",
              maxWidth: "360px",
              margin: "0 auto",
            }}>
              <p style={{ color: "#F87171", fontSize: "13px", marginBottom: "10px" }}>
                ⚠️ Please set your target role first
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/profile")}
                style={{
                  backgroundColor: "rgba(249,115,22,0.15)",
                  border: "1px solid rgba(249,115,22,0.3)",
                  color: "#F97316",
                  padding: "8px 20px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                Go to Profile
                <ArrowRight size={14} />
              </motion.button>
            </div>
          )}
        </motion.div>
      )}

    </div>
  );
};

export default Roadmap;