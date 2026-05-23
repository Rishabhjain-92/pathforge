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
          className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full"
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
    <div className="flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long", day: "numeric",
              month: "long", year: "numeric"
            })}
          </p>
          <h1 className="text-gray-900 dark:text-white text-2xl font-bold mt-1">
            Welcome back, <span className="text-orange-500">{user?.name}</span> 👋
          </h1>
        </div>
        <div className="text-sm bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-xl">
          {profile?.targetRole || "Set target role"}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ scale: 1.02 }}
            className={`bg-white dark:bg-gray-900 border border-gray-200 dark:${card.border} rounded-xl p-5 shadow-sm dark:shadow-none`}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-500 dark:text-gray-400 text-sm">{card.label}</p>
              <div className={`${card.bg} p-2 rounded-lg`}>
                <card.icon size={18} className={card.color} />
              </div>
            </div>
            <p className={`${card.color} text-xl font-bold truncate`}>
              {card.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Roadmap Progress */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm dark:shadow-none"
        >
          <div className="flex justify-between items-start mb-5">
            <div>
              <h2 className="text-gray-900 dark:text-white text-lg font-semibold">Roadmap Progress</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Track your Dream Role journey</p>
            </div>
            <span className="text-gray-500 dark:text-gray-400 text-sm">{profile?.roadmapProgress || 0}% completed</span>
          </div>

          <div className="mb-5">
            <div className="flex justify-between mb-2">
              <span className="text-gray-500 dark:text-gray-400 text-sm">Overall Completion</span>
              <span className="text-orange-500 text-sm font-semibold">{profile?.roadmapProgress || 0}%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${profile?.roadmapProgress || 0}%` }}
                transition={{ delay: 0.5, duration: 1 }}
                className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: "Completed", value: "0", textClass: "text-green-500", bgClass: "bg-green-50 dark:bg-green-500/10" },
              { label: "In Progress", value: "0", textClass: "text-orange-500", bgClass: "bg-orange-50 dark:bg-orange-500/10" },
              { label: "Upcoming", value: "0", textClass: "text-gray-500 dark:text-gray-400", bgClass: "bg-gray-50 dark:bg-gray-500/10" },
            ].map((s) => (
              <div key={s.label} className={`${s.bgClass} rounded-xl p-4 text-center`}>
                <p className={`${s.textClass} text-2xl md:text-3xl font-bold`}>{s.value}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/roadmap")}
            className="w-full bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 text-orange-600 dark:text-orange-400 p-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors hover:bg-orange-100 dark:hover:bg-orange-500/20"
          >
            <Zap size={16} />
            Generate Your Roadmap with AI
            <ArrowRight size={16} />
          </motion.button>
        </motion.div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white dark:bg-gray-900 border border-orange-200 dark:border-orange-500/20 rounded-xl p-6 shadow-sm dark:shadow-none"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={18} className="text-orange-500" />
            <h2 className="text-gray-900 dark:text-white text-lg font-semibold">AI Insights</h2>
          </div>

          <div className="flex flex-col gap-3">
            {[
              "Complete your profile to unlock AI-powered recommendations.",
              "Upload your resume this week to receive ATS analysis.",
              "Your profile matches 0% of your target role requirements.",
            ].map((text, i) => (
              <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3.5 border border-gray-100 dark:border-transparent">
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm dark:shadow-none"
        >
          <h2 className="text-gray-900 dark:text-white text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="flex flex-col gap-3">
            {[
              { icon: CheckCircle, text: "Profile updated", time: "Just now", colorClass: "text-green-500" },
              { icon: Star, text: "Skills added to profile", time: "Today", colorClass: "text-orange-500" },
              { icon: BookOpen, text: "Joined PathForge", time: `${getDaysOnPlatform()} day(s) ago`, colorClass: "text-blue-500" },
              { icon: Clock, text: "Resume not uploaded yet", time: "Pending", colorClass: "text-gray-500" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-xl p-3.5 border border-gray-100 dark:border-transparent">
                <item.icon size={18} className={`${item.colorClass} flex-shrink-0`} />
                <div>
                  <p className="text-gray-900 dark:text-white text-sm font-medium">{item.text}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">{item.time}</p>
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
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm dark:shadow-none flex flex-col"
        >
          <h2 className="text-gray-900 dark:text-white text-lg font-semibold mb-4">Recommended Next Steps</h2>
          <div className="flex flex-col gap-2 mb-4 flex-grow">
            {[
              { text: "Complete System Design Course", path: "/recommendations" },
              { text: "Upload resume for AI analysis", path: "/resume" },
              { text: "Generate Dream Role Roadmap", path: "/roadmap" },
              { text: "Apply to internships", path: "/recommendations" },
            ].map((step, i) => (
              <div
                key={i}
                onClick={() => navigate(step.path)}
                className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl p-3.5 cursor-pointer transition-colors border border-gray-100 dark:border-transparent"
              >
                <input type="checkbox" className="accent-orange-500 w-4 h-4 cursor-pointer" onClick={(e) => e.stopPropagation()} />
                <p className="text-gray-700 dark:text-gray-300 text-sm">{step.text}</p>
              </div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/roadmap")}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors mt-auto shadow-md shadow-orange-500/20"
          >
            View Full Roadmap
            <ArrowRight size={16} />
          </motion.button>
        </motion.div>
      </div>

      {/* Skills */}
      {profile?.skills?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm dark:shadow-none"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-gray-900 dark:text-white text-base font-semibold">Your Skills</h2>
            <button onClick={() => navigate("/profile")} className="text-orange-500 hover:text-orange-600 dark:hover:text-orange-400 text-sm font-medium transition-colors">Edit →</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill, i) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.03 }}
                className="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 text-orange-600 dark:text-orange-400 px-3 py-1 rounded-full text-xs font-medium"
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