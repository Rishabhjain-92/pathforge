import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp, Target, Building, Calendar,
  CheckCircle, Zap, ArrowRight,
  BookOpen, Star, Sparkles, Clock,
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/api/user/profile",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProfile(res.data.user);
      } catch (error) {
        console.error("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const getDaysOnPlatform = () => {
    if (!profile?.createdAt) return 1;
    const created = new Date(profile.createdAt);
    const now = new Date();
    return Math.max(1, Math.floor((now - created) / (1000 * 60 * 60 * 24)));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-7 h-7 border-2 border-orange-500/30 border-t-orange-500 rounded-full"
        />
      </div>
    );
  }

  const statCards = [
    { label: "Readiness Score", value: `${profile?.readinessScore || 0}%`, icon: TrendingUp, color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20" },
    { label: "Target Role", value: profile?.targetRole || "Not set", icon: Target, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { label: "Target Company", value: profile?.targetCompany || "Not set", icon: Building, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
    { label: "Days on Platform", value: getDaysOnPlatform(), icon: Calendar, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ color: "#9CA3AF", fontSize: "12px" }}>
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long", day: "numeric",
              month: "long", year: "numeric"
            })}
          </p>
          <h1 style={{ color: "white", fontSize: "18px", fontWeight: "700", marginTop: "2px" }}>
            Welcome back, <span style={{ color: "#F97316" }}>{user?.name}</span> 👋
          </h1>
        </div>
        <div style={{ fontSize: "12px", background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)", color: "#FB923C", padding: "6px 12px", borderRadius: "8px" }}>
          {profile?.targetRole || "Set target role"}
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ scale: 1.02 }}
            className={`bg-gray-900 border ${card.border} rounded-xl`}
            style={{ padding: "16px" }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
              <p style={{ color: "#9CA3AF", fontSize: "12px" }}>{card.label}</p>
              <div className={`${card.bg} p-1.5 rounded-lg`}>
                <card.icon size={14} className={card.color} />
              </div>
            </div>
            <p className={card.color} style={{ fontSize: "16px", fontWeight: "700", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {card.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Middle Row */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "12px" }}>

        {/* Roadmap Progress */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900 border border-gray-800 rounded-xl"
          style={{ padding: "20px" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
            <div>
              <h2 style={{ color: "white", fontSize: "15px", fontWeight: "600" }}>Roadmap Progress</h2>
              <p style={{ color: "#6B7280", fontSize: "12px", marginTop: "2px" }}>Track your Dream Role journey</p>
            </div>
            <span style={{ color: "#6B7280", fontSize: "12px" }}>{profile?.roadmapProgress || 0}% completed</span>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ color: "#9CA3AF", fontSize: "12px" }}>Overall Completion</span>
              <span style={{ color: "#F97316", fontSize: "12px", fontWeight: "600" }}>{profile?.roadmapProgress || 0}%</span>
            </div>
            <div style={{ width: "100%", height: "6px", background: "#1F2937", borderRadius: "999px", overflow: "hidden" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${profile?.roadmapProgress || 0}%` }}
                transition={{ delay: 0.5, duration: 1 }}
                style={{ height: "100%", background: "linear-gradient(to right, #EA580C, #FB923C)", borderRadius: "999px" }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "16px" }}>
            {[
              { label: "Completed", value: "0", color: "#4ADE80", bg: "rgba(74,222,128,0.1)" },
              { label: "In Progress", value: "0", color: "#FB923C", bg: "rgba(251,146,60,0.1)" },
              { label: "Upcoming", value: "0", color: "#6B7280", bg: "rgba(107,114,128,0.1)" },
            ].map((s) => (
              <div key={s.label} style={{ background: s.bg, borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                <p style={{ fontSize: "22px", fontWeight: "700", color: s.color }}>{s.value}</p>
                <p style={{ fontSize: "11px", color: "#6B7280", marginTop: "2px" }}>{s.label}</p>
              </div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/roadmap")}
            style={{ width: "100%", background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.3)", color: "#FB923C", padding: "10px", borderRadius: "10px", fontSize: "13px", fontWeight: "500", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", cursor: "pointer" }}
          >
            <Zap size={14} />
            Generate Your Roadmap with AI
            <ArrowRight size={14} />
          </motion.button>
        </motion.div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-gray-900 border border-orange-500/20 rounded-xl"
          style={{ padding: "20px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
            <Sparkles size={15} className="text-orange-500" />
            <h2 style={{ color: "white", fontSize: "14px", fontWeight: "600" }}>AI Insights</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {[
              "Complete your profile to unlock AI-powered recommendations.",
              "Upload your resume this week to receive ATS analysis.",
              "Your profile matches 0% of your target role requirements.",
            ].map((text, i) => (
              <div key={i} style={{ background: "#1F2937", borderRadius: "8px", padding: "10px" }}>
                <p style={{ color: "#D1D5DB", fontSize: "12px", lineHeight: "1.5" }}>{text}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-900 border border-gray-800 rounded-xl"
          style={{ padding: "20px" }}
        >
          <h2 style={{ color: "white", fontSize: "14px", fontWeight: "600", marginBottom: "12px" }}>Recent Activity</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {[
              { icon: CheckCircle, text: "Profile updated", time: "Just now", color: "#4ADE80" },
              { icon: Star, text: "Skills added to profile", time: "Today", color: "#FB923C" },
              { icon: BookOpen, text: "Joined PathForge", time: `${getDaysOnPlatform()} day(s) ago`, color: "#60A5FA" },
              { icon: Clock, text: "Resume not uploaded yet", time: "Pending", color: "#6B7280" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", background: "#1F2937", borderRadius: "8px", padding: "10px" }}>
                <item.icon size={15} style={{ color: item.color, flexShrink: 0 }} />
                <div>
                  <p style={{ color: "white", fontSize: "12px", fontWeight: "500" }}>{item.text}</p>
                  <p style={{ color: "#6B7280", fontSize: "11px", marginTop: "2px" }}>{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-gray-900 border border-gray-800 rounded-xl"
          style={{ padding: "20px" }}
        >
          <h2 style={{ color: "white", fontSize: "14px", fontWeight: "600", marginBottom: "12px" }}>Recommended Next Steps</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "12px" }}>
            {[
              { text: "Complete System Design Course", path: "/recommendations" },
              { text: "Upload resume for AI analysis", path: "/resume" },
              { text: "Generate Dream Role Roadmap", path: "/roadmap" },
              { text: "Apply to internships", path: "/recommendations" },
            ].map((step, i) => (
              <div
                key={i}
                onClick={() => navigate(step.path)}
                style={{ display: "flex", alignItems: "center", gap: "10px", background: "#1F2937", borderRadius: "8px", padding: "10px", cursor: "pointer" }}
              >
                <input type="checkbox" style={{ accentColor: "#F97316", width: "14px", height: "14px" }} onClick={(e) => e.stopPropagation()} />
                <p style={{ color: "#D1D5DB", fontSize: "12px" }}>{step.text}</p>
              </div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/roadmap")}
            style={{ width: "100%", background: "#F97316", color: "white", padding: "10px", borderRadius: "10px", fontSize: "13px", fontWeight: "500", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", cursor: "pointer", border: "none" }}
          >
            View Full Roadmap
            <ArrowRight size={14} />
          </motion.button>
        </motion.div>
      </div>

      {/* Skills */}
      {profile?.skills?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-900 border border-gray-800 rounded-xl"
          style={{ padding: "16px" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <h2 style={{ color: "white", fontSize: "13px", fontWeight: "600" }}>Your Skills</h2>
            <button onClick={() => navigate("/profile")} style={{ color: "#F97316", fontSize: "12px", background: "none", border: "none", cursor: "pointer" }}>Edit →</button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {profile.skills.map((skill, i) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.03 }}
                style={{ background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.3)", color: "#FB923C", padding: "3px 10px", borderRadius: "999px", fontSize: "11px" }}
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}

    </div>
  );
};

export default Dashboard;