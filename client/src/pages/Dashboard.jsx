import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import {
  TrendingUp,
  Target,
  Building,
  Calendar,
  CheckCircle,
  Zap,
  ArrowRight,
  BookOpen,
  Star,
  Sparkles,
  Clock,
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
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
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

    return Math.max(
      1,
      Math.floor((now - created) / (1000 * 60 * 60 * 24))
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
          className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 md:space-y-5">

{/* Header */}
<motion.div
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
>
  <div>
    <p className="text-gray-400 text-sm">
      {new Date().toLocaleDateString("en-IN", {
        weekday: "long", day: "numeric",
        month: "long", year: "numeric"
      })}
    </p>
    <h1 className="text-lg font-bold text-white mt-0.5">
      Welcome back,{" "}
      <span className="text-orange-500">{user?.name}</span> 👋
    </h1>
  </div>
  <div className="text-xs bg-orange-500/10 border border-orange-500/20 text-orange-400 px-3 py-1.5 rounded-lg">
    {profile?.targetRole || "Set your target role"}
  </div>
</motion.div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">

        {[
          {
            label: "Readiness Score",
            value: `${profile?.readinessScore || 0}%`,
            icon: TrendingUp,
            color: "text-orange-500",
            bg: "bg-orange-500/10",
            border: "border-orange-500/20",
          },

          {
            label: "Target Role",
            value: profile?.targetRole || "Not set",
            icon: Target,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
            border: "border-blue-500/20",
          },

          {
            label: "Target Company",
            value: profile?.targetCompany || "Not set",
            icon: Building,
            color: "text-green-400",
            bg: "bg-green-500/10",
            border: "border-green-500/20",
          },

          {
            label: "Days on Platform",
            value: getDaysOnPlatform(),
            icon: Calendar,
            color: "text-purple-400",
            bg: "bg-purple-500/10",
            border: "border-purple-500/20",
          },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -2 }}
            className={`bg-[#111827] border ${card.border} rounded-2xl p-5`}
          >

            <div className="flex items-center justify-between mb-4">

              <p className="text-gray-400 text-sm">
                {card.label}
              </p>

              <div className={`${card.bg} p-2 rounded-lg`}>
                <card.icon
                  size={16}
                  className={card.color}
                />
              </div>
            </div>

            <h2
              className={`text-2xl font-bold ${card.color} truncate`}
            >
              {card.value}
            </h2>

          </motion.div>
        ))}
      </div>

      {/* MIDDLE SECTION */}
      <div className="grid grid-cols-12 gap-3 md:gap-5">

        {/* ROADMAP */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="col-span-12 xl:col-span-8 bg-[#111827] border border-[#1F2937] rounded-2xl p-6"
        >

          <div className="flex items-center justify-between mb-5">

            <div>
              <h2 className="text-white text-xl font-semibold">
                Roadmap Progress
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                Track your Dream Role journey
              </p>
            </div>

            <span className="text-gray-500 text-sm">
              {profile?.roadmapProgress || 0}% completed
            </span>

          </div>

          {/* Progress Bar */}
          <div className="mb-6">

            <div className="flex justify-between mb-2 text-sm">
              <span className="text-gray-400">
                Overall Completion
              </span>

              <span className="text-orange-500 font-medium">
                {profile?.roadmapProgress || 0}%
              </span>
            </div>

            <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">

              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${profile?.roadmapProgress || 0}%`,
                }}
                transition={{
                  duration: 1,
                  delay: 0.4,
                }}
                className="h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full"
              />

            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">

            {[
              {
                label: "Completed",
                value: "0",
                color: "text-green-400",
                bg: "bg-green-500/10",
              },

              {
                label: "In Progress",
                value: "0",
                color: "text-orange-400",
                bg: "bg-orange-500/10",
              },

              {
                label: "Upcoming",
                value: "0",
                color: "text-gray-400",
                bg: "bg-gray-800",
              },
            ].map((item) => (
              <div
                key={item.label}
                className={`${item.bg} rounded-2xl p-5 text-center`}
              >
                <h3 className={`text-3xl font-bold ${item.color}`}>
                  {item.value}
                </h3>

                <p className="text-gray-500 text-sm mt-1">
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/roadmap")}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-2xl font-medium flex items-center justify-center gap-2 transition"
          >
            <Zap size={16} />

            Generate Your Roadmap with AI

            <ArrowRight size={16} />
          </motion.button>

        </motion.div>

        {/* AI INSIGHTS */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="col-span-12 xl:col-span-4 bg-[#111827] border border-orange-500/20 rounded-2xl p-6"
        >

          <div className="flex items-center gap-2 mb-5">

            <Sparkles
              size={18}
              className="text-orange-500"
            />

            <h2 className="text-white text-lg font-semibold">
              AI Insights
            </h2>
          </div>

          <div className="space-y-3">

            {[
              {
                text: "Complete your profile to unlock AI-powered recommendations.",
              },

              {
                text: "Upload your resume this week to receive ATS analysis.",
              },

              {
                text: "Your current profile matches 0% of your target role requirements.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-gray-800 rounded-xl p-4"
              >
                <p className="text-sm text-gray-300 leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

        </motion.div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="grid grid-cols-12 gap-3 md:gap-5">

        {/* RECENT ACTIVITY */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="col-span-12 xl:col-span-6 bg-[#111827] border border-[#1F2937] rounded-2xl p-6"
        >

          <h2 className="text-white text-lg font-semibold mb-5">
            Recent Activity
          </h2>

          <div className="space-y-3">

            {[
              {
                icon: CheckCircle,
                text: "Profile updated",
                time: "Just now",
                color: "text-green-400",
              },

              {
                icon: Star,
                text: "Skills added to profile",
                time: "Today",
                color: "text-orange-400",
              },

              {
                icon: BookOpen,
                text: "Joined PathForge",
                time: `${getDaysOnPlatform()} day(s) ago`,
                color: "text-blue-400",
              },

              {
                icon: Clock,
                text: "Resume not uploaded yet",
                time: "Pending",
                color: "text-gray-500",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 bg-gray-800 rounded-xl p-4"
              >
                <item.icon
                  size={18}
                  className={item.color}
                />

                <div>
                  <p className="text-white text-sm font-medium">
                    {item.text}
                  </p>

                  <p className="text-gray-500 text-xs mt-1">
                    {item.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </motion.div>

        {/* NEXT STEPS */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="col-span-12 xl:col-span-6 bg-[#111827] border border-[#1F2937] rounded-2xl p-6"
        >

          <h2 className="text-white text-lg font-semibold mb-5">
            Recommended Next Steps
          </h2>

          <div className="space-y-3 mb-5">

            {[
              {
                text: "Complete System Design Course",
                path: "/recommendations",
              },

              {
                text: "Upload your resume for AI analysis",
                path: "/resume",
              },

              {
                text: "Generate your Dream Role Roadmap",
                path: "/roadmap",
              },

              {
                text: "Apply to internships",
                path: "/recommendations",
              },
            ].map((step, i) => (
              <div
                key={i}
                onClick={() => navigate(step.path)}
                className="flex items-center gap-3 bg-gray-800 hover:bg-gray-700 rounded-xl p-4 cursor-pointer transition"
              >

                <input
                  type="checkbox"
                  className="accent-orange-500"
                />

                <p className="text-sm text-gray-300">
                  {step.text}
                </p>

              </div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/roadmap")}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-2xl font-medium flex items-center justify-center gap-2 transition"
          >
            View Full Roadmap

            <ArrowRight size={16} />
          </motion.button>

        </motion.div>
      </div>

      {/* SKILLS */}
      {profile?.skills?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-[#111827] border border-[#1F2937] rounded-2xl p-5"
        >

          <div className="flex items-center justify-between mb-4">

            <h2 className="text-white text-lg font-semibold">
              Your Skills
            </h2>

            <button
              onClick={() => navigate("/profile")}
              className="text-orange-500 text-sm hover:underline"
            >
              Edit →
            </button>
          </div>

          <div className="flex flex-wrap gap-2">

            {profile.skills.map((skill, i) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.5 + i * 0.03,
                }}
                className="bg-orange-500/10 border border-orange-500/30 text-orange-400 px-3 py-1 rounded-full text-sm"
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