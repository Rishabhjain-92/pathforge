import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp, Target, Building, Calendar,
  CheckCircle, Zap, ArrowRight,
  BookOpen, Star, Sparkles
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
      } catch {
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

  const statCards = [
    {
      label: "Readiness Score",
      value: `${profile?.readinessScore || 0}%`,
      icon: TrendingUp,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
      glow: "shadow-orange-500/10"
    },
    {
      label: "Target Role",
      value: profile?.targetRole || "Not set",
      icon: Target,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      glow: "shadow-blue-500/10"
    },
    {
      label: "Target Company",
      value: profile?.targetCompany || "Not set",
      icon: Building,
      color: "text-green-400",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
      glow: "shadow-green-500/10"
    },
    {
      label: "Days on PathForge",
      value: getDaysOnPlatform(),
      icon: Calendar,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      glow: "shadow-purple-500/10"
    },
  ];

  const recentActivity = [
    { icon: CheckCircle, text: "Profile updated", time: "Just now", color: "text-green-400" },
    { icon: Star, text: "Skills added to profile", time: "Today", color: "text-orange-400" },
    { icon: BookOpen, text: "Joined PathForge", time: `${getDaysOnPlatform()} days ago`, color: "text-blue-400" },
  ];

  const nextSteps = [
    { text: "Upload your resume for AI analysis", icon: "📄" },
    { text: "Generate your Dream Role Roadmap", icon: "🗺️" },
    { text: "Check your Skill Gap analysis", icon: "📊" },
    { text: "Explore course recommendations", icon: "📚" },
  ];

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

  return (
    <div className="space-y-6">

      {/* Floating background orbs */}
      <div className="fixed top-20 right-20 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 left-72 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <span className="text-3xl">👋</span>
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold text-white">
              Welcome back,{" "}
              <motion.span
                className="text-orange-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {user?.name}
              </motion.span>
            </h1>
            <p className="text-gray-400 mt-0.5">
              Here's your career progress overview
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 + 0.2, duration: 0.4 }}
            whileHover={{
              scale: 1.03,
              transition: { duration: 0.2 }
            }}
            className={`bg-gray-900 border ${card.border} rounded-xl p-5 cursor-default shadow-lg ${card.glow} relative overflow-hidden`}
          >
            {/* Subtle card glow */}
            <motion.div
              className={`absolute inset-0 ${card.bg} opacity-0`}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-gray-400 text-sm">{card.label}</p>
                <motion.div
                  className={`${card.bg} p-2 rounded-lg`}
                  whileHover={{ rotate: 15 }}
                  transition={{ duration: 0.2 }}
                >
                  <card.icon size={16} className={card.color} />
                </motion.div>
              </div>
              <motion.p
                className={`text-2xl font-bold ${card.color}`}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.1 + 0.4, type: "spring" }}
              >
                {card.value}
              </motion.p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Roadmap Progress */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-lg">
              Roadmap Progress
            </h2>
            <span className="text-gray-400 text-sm">0 of 0 tasks</span>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Overall Completion</span>
              <span className="text-orange-500 font-medium">0%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${profile?.roadmapProgress || 0}%` }}
                transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
                className="bg-linear-to-r from-orange-600 to-orange-400 h-2.5 rounded-full relative"
              >
                <motion.div
                  className="absolute inset-0 bg-white/20 rounded-full"
                  animate={{ x: ["0%", "100%"] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{ width: "30%" }}
                />
              </motion.div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            {[
              { label: "Completed", value: "0", color: "text-green-400", bg: "bg-green-500/10" },
              { label: "In Progress", value: "0", color: "text-orange-400", bg: "bg-orange-500/10" },
              { label: "Upcoming", value: "0", color: "text-gray-400", bg: "bg-gray-700/50" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + i * 0.1 }}
                className={`${stat.bg} rounded-xl p-4 text-center`}
              >
                <p className={`text-3xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
                <p className="text-gray-500 text-xs mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/roadmap")}
            className="w-full mt-5 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 py-3 rounded-xl text-sm font-medium transition flex items-center justify-center gap-2 group"
          >
            <Zap size={16} />
            Generate Your Roadmap with AI
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight size={16} />
            </motion.div>
          </motion.button>
        </motion.div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gray-900 border border-orange-500/20 rounded-xl p-6 relative overflow-hidden"
        >
          <motion.div
            className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          <div className="flex items-center gap-2 mb-4 relative z-10">
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            >
              <Sparkles size={18} className="text-orange-500" />
            </motion.div>
            <h2 className="text-white font-semibold">AI Insights</h2>
          </div>

          <div className="space-y-3 relative z-10">
            {[
              {
                text: "Complete your profile setup to unlock personalized AI recommendations.",
                highlight: "profile setup"
              },
              {
                text: "Upload your resume to get ATS score and missing skills analysis.",
                highlight: "ATS score"
              },
              {
                text: "Generate your Dream Role Roadmap to start tracking progress.",
                highlight: "Dream Role Roadmap"
              },
            ].map((insight, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.15 }}
                whileHover={{ x: 3 }}
                className="bg-gray-800 hover:bg-gray-750 rounded-lg p-3 transition cursor-default"
              >
                <p className="text-gray-300 text-sm leading-relaxed">
                  {insight.text.split(insight.highlight).map((part, j) => (
                    j === 0 ? (
                      <span key={j}>{part}
                        <span className="text-orange-400 font-medium">
                          {insight.highlight}
                        </span>
                      </span>
                    ) : (
                      <span key={j}>{part}</span>
                    )
                  ))}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gray-900 border border-gray-800 rounded-xl p-6"
        >
          <h2 className="text-white font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.map((activity, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + i * 0.1 }}
                whileHover={{ x: 4 }}
                className="flex items-center gap-3 p-3 bg-gray-800 rounded-xl transition cursor-default"
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 10 }}
                >
                  <activity.icon size={18} className={activity.color} />
                </motion.div>
                <div className="flex-1">
                  <p className="text-white text-sm">{activity.text}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{activity.time}</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-gray-700" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recommended Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-gray-900 border border-gray-800 rounded-xl p-6"
        >
          <h2 className="text-white font-semibold mb-4">
            Recommended Next Steps
          </h2>
          <div className="space-y-2">
            {nextSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + i * 0.1 }}
                whileHover={{ x: 4, backgroundColor: "rgba(249,115,22,0.05)" }}
                className="flex items-center gap-3 p-3 rounded-xl cursor-pointer group transition"
              >
                <span className="text-lg">{step.icon}</span>
                <p className="text-gray-300 text-sm group-hover:text-white transition flex-1">
                  {step.text}
                </p>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  <ArrowRight size={14} className="text-orange-500" />
                </motion.div>
              </motion.div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/roadmap")}
            className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl text-sm font-medium transition flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
          >
            View Full Roadmap
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight size={16} />
            </motion.div>
          </motion.button>
        </motion.div>

      </div>

      {/* Skills Overview */}
      {profile?.skills?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="bg-gray-900 border border-gray-800 rounded-xl p-6"
        >
          <h2 className="text-white font-semibold mb-4">Your Skills</h2>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill, i) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 1.1 + i * 0.05,
                  type: "spring",
                  stiffness: 200
                }}
                whileHover={{ scale: 1.1 }}
                className="bg-orange-500/10 border border-orange-500/30 text-orange-400 px-3 py-1 rounded-full text-sm cursor-default"
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