import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp, Target, Building, Calendar,
  CheckCircle, Zap, ArrowRight,
  BookOpen, Star, Sparkles, Clock, HelpCircle, Trophy
} from "lucide-react";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Trivia states
  const [dailyQuiz, setDailyQuiz] = useState(null);
  const [quizLoading, setQuizLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [streak, setStreak] = useState(3);
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false);

  useEffect(() => {
    const fetchProfileAndQuiz = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // Fetch Profile
        const profileRes = await axios.get(
          "http://localhost:5000/api/user/profile",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProfile(profileRes.data.user);
        
        // Fetch Daily Quiz
        const quizRes = await axios.get(
          "http://localhost:5000/api/ai/daily-quiz",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setDailyQuiz(quizRes.data.quiz);

      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
        setQuizLoading(false);
      }
    };
    fetchProfileAndQuiz();
  }, []);

  const getDaysOnPlatform = () => {
    if (!profile?.createdAt) return 1;
    const created = new Date(profile.createdAt);
    const now = new Date();
    return Math.max(1, Math.floor((now - created) / (1000 * 60 * 60 * 24)));
  };

  const handleSelectOption = (idx) => {
    if (hasAnswered || !dailyQuiz) return;
    setSelectedOption(idx);
    setHasAnswered(true);
    
    const isCorrect = idx === dailyQuiz.correctIndex;
    setAnsweredCorrectly(isCorrect);
    
    if (isCorrect) {
      setStreak(prev => prev + 1);
      toast.success("Correct! Your streak is glowing 🔥", {
        style: {
          borderRadius: "16px",
          background: "rgba(17, 24, 39, 0.9)",
          color: "#fff",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(249, 115, 22, 0.2)"
        }
      });
    } else {
      setStreak(0);
      toast.error("Not quite! Study the explanation below.", {
        style: {
          borderRadius: "16px",
          background: "rgba(17, 24, 39, 0.9)",
          color: "#fff",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(239, 68, 68, 0.2)"
        }
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-3 border-orange-500/20 border-t-orange-500 rounded-full"
        />
      </div>
    );
  }

  const statCards = [
    { label: "Readiness Score", value: `${profile?.readinessScore || 0}%`, icon: TrendingUp, color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20" },
    { label: "Target Role", value: profile?.targetRole || "Not set", icon: Target, color: "text-blue-500 dark:text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { label: "Target Company", value: profile?.targetCompany || "Not set", icon: Building, color: "text-emerald-500 dark:text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { label: "Days on Platform", value: getDaysOnPlatform(), icon: Calendar, color: "text-purple-500 dark:text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  ];

  return (
    <div className="relative min-h-screen pb-10">
      
      {/* 🌅 Sunset Glassmorphic Ambient Background Blobs */}
      <div className="fixed top-1/4 right-[10%] w-[350px] h-[350px] bg-gradient-to-tr from-orange-500/10 to-rose-500/10 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="fixed bottom-1/4 left-[5%] w-[350px] h-[350px] bg-gradient-to-br from-violet-600/10 to-indigo-600/10 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="relative z-10 flex flex-col gap-6 max-w-7xl mx-auto px-2">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
          <div>
            <p className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-widest">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long", day: "numeric",
                month: "long", year: "numeric"
              })}
            </p>
            <h1 className="text-gray-900 dark:text-white text-3xl font-extrabold mt-1 tracking-tight">
              Welcome back, <span className="bg-gradient-to-r from-orange-500 via-rose-500 to-violet-500 bg-clip-text text-transparent">{user?.name}</span> 👋
            </h1>
          </div>
          <div className="self-start sm:self-center text-xs font-bold bg-orange-500/5 dark:bg-orange-500/10 border border-orange-500/20 dark:border-orange-500/30 text-orange-600 dark:text-orange-400 px-4 py-2.5 rounded-2xl backdrop-blur-md">
            {profile?.targetRole || "Set target role"}
          </div>
        </div>

        {/* Premium Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {statCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -4, scale: 1.01 }}
              className="group bg-white/40 dark:bg-gray-900/40 backdrop-blur-md border border-white/20 dark:border-gray-800/80 rounded-2xl p-5 shadow-lg shadow-gray-200/5 dark:shadow-none hover:border-orange-500/30 dark:hover:border-orange-500/40 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3.5">
                <span className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-wider">{card.label}</span>
                <div className={`${card.bg} p-2.5 rounded-xl transition-transform duration-300 group-hover:scale-105`}>
                  <card.icon size={16} className={card.color} />
                </div>
              </div>
              <p className="text-gray-900 dark:text-white text-2xl font-black tracking-tight truncate">
                {card.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Middle Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Roadmap Progress Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-white/40 dark:bg-gray-900/40 backdrop-blur-md border border-white/20 dark:border-gray-800/80 rounded-2xl p-6 shadow-lg shadow-gray-200/5 dark:shadow-none flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-5">
                <div>
                  <h2 className="text-gray-900 dark:text-white text-lg font-bold tracking-tight">Roadmap Progress</h2>
                  <p className="text-gray-400 dark:text-gray-500 text-xs mt-0.5">Track your Dream Role journey</p>
                </div>
                <span className="text-xs font-extrabold bg-orange-500/10 text-orange-500 px-3.5 py-1.5 rounded-full">{profile?.roadmapProgress || 0}% Completed</span>
              </div>

              {/* Glowing Horizontal Progress Track */}
              <div className="mb-6">
                <div className="flex justify-between mb-2 text-xs font-bold text-gray-500 dark:text-gray-400">
                  <span>Overall Completion</span>
                  <span className="text-orange-500 font-extrabold">{profile?.roadmapProgress || 0}%</span>
                </div>
                <div className="w-full h-2.5 bg-gray-150 dark:bg-gray-800/50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${profile?.roadmapProgress || 0}%` }}
                    transition={{ delay: 0.4, duration: 1 }}
                    className="h-full bg-gradient-to-r from-orange-500 via-rose-500 to-orange-400 rounded-full"
                  />
                </div>
              </div>

              {/* Split Stats Breakdown */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { label: "Completed", value: "0", textClass: "text-emerald-500", bgClass: "bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/10" },
                  { label: "In Progress", value: "0", textClass: "text-orange-500", bgClass: "bg-orange-500/5 dark:bg-orange-500/10 border-orange-500/10" },
                  { label: "Upcoming", value: "0", textClass: "text-gray-500 dark:text-gray-400", bgClass: "bg-gray-100/5 dark:bg-gray-800/40 border-gray-200/20 dark:border-transparent" },
                ].map((s) => (
                  <div key={s.label} className={`${s.bgClass} border rounded-2xl p-4 text-center hover:scale-[1.02] transition-transform duration-300`}>
                    <p className={`${s.textClass} text-2xl md:text-3xl font-extrabold tracking-tight`}>{s.value}</p>
                    <p className="text-gray-400 dark:text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-wider mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/roadmap")}
              className="w-full bg-orange-500/5 dark:bg-orange-500/10 border border-orange-500/25 dark:border-orange-500/30 text-orange-600 dark:text-orange-400 p-3.5 rounded-2xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 hover:bg-orange-500/10 dark:hover:bg-orange-500/20 transition-all"
            >
              <Zap size={14} className="fill-orange-500/10 animate-pulse" />
              Generate Your Roadmap with AI
              <ArrowRight size={14} />
            </motion.button>
          </motion.div>

          {/* AI Insights Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-md border border-orange-500/20 dark:border-orange-500/30 rounded-2xl p-6 shadow-lg shadow-gray-200/5 dark:shadow-none flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={16} className="text-orange-500 animate-pulse" />
                <h2 className="text-gray-900 dark:text-white text-base font-bold tracking-tight">AI Insights</h2>
              </div>

              <div className="flex flex-col gap-3">
                {[
                  "Complete your profile to unlock AI-powered recommendations.",
                  "Upload your resume this week to receive ATS analysis.",
                  "Your profile matches 0% of your target role requirements.",
                ].map((text, i) => (
                  <div key={i} className="bg-orange-500/5 dark:bg-orange-500/5 rounded-2xl p-3.5 border border-orange-500/10 dark:border-orange-500/10 hover:bg-orange-500/10 dark:hover:bg-orange-500/8 transition-colors duration-300">
                    <p className="text-gray-650 dark:text-gray-300 text-xs md:text-sm leading-relaxed font-semibold">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Row - Responsive 3 Columns Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

          {/* Recent Activity Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-md border border-white/20 dark:border-gray-800/80 rounded-2xl p-6 shadow-lg shadow-gray-200/5 dark:shadow-none flex flex-col justify-between"
          >
            <div>
              <h2 className="text-gray-900 dark:text-white text-base font-bold tracking-tight mb-4">Recent Activity</h2>
              <div className="flex flex-col gap-3">
                {[
                  { icon: CheckCircle, text: "Profile updated", time: "Just now", colorClass: "text-emerald-500", bgClass: "bg-emerald-500/10" },
                  { icon: Star, text: "Skills added to profile", time: "Today", colorClass: "text-orange-500", bgClass: "bg-orange-500/10" },
                  { icon: BookOpen, text: "Joined PathForge", time: `${getDaysOnPlatform()} day(s) ago`, colorClass: "text-blue-500", bgClass: "bg-blue-500/10" },
                  { icon: Clock, text: "Resume not uploaded yet", time: "Pending", colorClass: "text-gray-400", bgClass: "bg-gray-100 dark:bg-gray-800" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-gray-150/20 dark:bg-gray-800/30 border border-gray-200/10 dark:border-gray-800/50 rounded-2xl p-3.5 hover:bg-gray-150/40 dark:hover:bg-gray-800/50 transition-colors duration-300">
                    <div className={`${item.bgClass} p-2.5 rounded-xl flex-shrink-0`}>
                      <item.icon size={15} className={`${item.colorClass}`} />
                    </div>
                    <div>
                      <p className="text-gray-800 dark:text-gray-200 text-xs md:text-sm font-semibold">{item.text}</p>
                      <p className="text-gray-400 dark:text-gray-500 text-[10px] mt-0.5">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Recommended Next Steps Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-md border border-white/20 dark:border-gray-800/80 rounded-2xl p-6 shadow-lg shadow-gray-200/5 dark:shadow-none flex flex-col justify-between"
          >
            <div>
              <h2 className="text-gray-900 dark:text-white text-base font-bold tracking-tight mb-4">Recommended Next Steps</h2>
              <div className="flex flex-col gap-2.5 mb-5">
                {[
                  { text: "Complete System Design Course", path: "/recommendations" },
                  { text: "Upload resume for AI analysis", path: "/resume" },
                  { text: "Generate Dream Role Roadmap", path: "/roadmap" },
                  { text: "Apply to internships", path: "/recommendations" },
                ].map((step, i) => (
                  <div
                    key={i}
                    onClick={() => navigate(step.path)}
                    className="flex items-center gap-3.5 bg-gray-150/20 dark:bg-gray-850/40 border border-gray-200/10 dark:border-gray-800/40 hover:bg-gray-150/40 dark:hover:bg-gray-850/60 rounded-2xl p-3.5 cursor-pointer transition-all duration-300"
                  >
                    <input
                      type="checkbox"
                      className="accent-orange-500 w-4 h-4 cursor-pointer rounded-md"
                      onClick={(e) => e.stopPropagation()}
                      readOnly
                      checked={false}
                    />
                    <p className="text-gray-700 dark:text-gray-300 text-xs md:text-sm font-semibold">{step.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/roadmap")}
              className="w-full bg-orange-500 hover:bg-orange-600 active:scale-98 text-white p-3.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-500/20"
            >
              View Full Roadmap
              <ArrowRight size={14} />
            </motion.button>
          </motion.div>

          {/* 🧠 Unique Interactive Daily Tech Quest Quiz Widget */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-md border border-white/20 dark:border-gray-800/80 rounded-2xl p-6 shadow-lg shadow-gray-200/5 dark:shadow-none flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-1.5">
                  <HelpCircle size={16} className="text-orange-500 animate-pulse" />
                  <h2 className="text-gray-900 dark:text-white text-base font-bold tracking-tight">AI Daily Tech Quest</h2>
                </div>
                <span className="text-[10px] font-extrabold bg-orange-500/10 text-orange-500 px-2.5 py-1 rounded-full flex items-center gap-1">
                  🔥 {streak} DAY STREAK
                </span>
              </div>
              
              {quizLoading ? (
                <div className="flex flex-col items-center justify-center py-6 gap-3">
                   <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full" />
                   <p className="text-xs text-gray-500 dark:text-gray-400 font-medium animate-pulse">AI is generating your daily quest...</p>
                </div>
              ) : dailyQuiz ? (
                <>
                  <p className="text-gray-700 dark:text-gray-200 text-xs md:text-sm font-semibold mb-3 leading-relaxed">
                    {dailyQuiz.question}
                  </p>

                  <div className="flex flex-col gap-2">
                    {dailyQuiz.options.map((option, idx) => {
                      const isSelected = selectedOption === idx;
                      const isCorrectOption = idx === dailyQuiz.correctIndex;
                      
                      let buttonStyle = "border-gray-200/60 dark:border-gray-800 hover:border-orange-500/50 hover:bg-orange-500/5 text-gray-700 dark:text-gray-300";
                      if (hasAnswered) {
                        if (isCorrectOption) {
                          buttonStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold";
                        } else if (isSelected) {
                          buttonStyle = "border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400";
                        } else {
                          buttonStyle = "border-gray-200/20 dark:border-gray-800/20 text-gray-400 opacity-60";
                        }
                      }

                      return (
                        <button
                          key={idx}
                          disabled={hasAnswered}
                          onClick={() => handleSelectOption(idx)}
                          className={`w-full text-left p-3 rounded-2xl border text-xs font-semibold transition-all duration-300 flex justify-between items-center ${buttonStyle}`}
                        >
                          <span>{option}</span>
                          {hasAnswered && isCorrectOption && <Trophy size={12} className="text-emerald-500 flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Quiz explanation */}
                  <AnimatePresence>
                    {hasAnswered && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3.5 p-3.5 bg-gray-50/60 dark:bg-gray-800/40 border border-gray-150/40 dark:border-gray-800/80 rounded-2xl overflow-hidden"
                      >
                        <p className="text-[9px] font-extrabold uppercase text-gray-400 dark:text-gray-500 tracking-wider">Explanation</p>
                        <p className="text-gray-500 dark:text-gray-450 text-[11px] leading-relaxed mt-1">
                          {dailyQuiz.explanation}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <p className="text-xs text-red-500 py-4 text-center">Failed to load daily quest.</p>
              )}
            </div>

          </motion.div>
        </div>

        {/* Your Skills Showcase Badge Grid */}
        {profile?.skills?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-md border border-white/20 dark:border-gray-800/80 rounded-2xl p-6 shadow-lg shadow-gray-200/5 dark:shadow-none"
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-gray-900 dark:text-white text-base font-bold tracking-tight">Your Skills</h2>
                <p className="text-gray-400 dark:text-gray-500 text-xs mt-0.5">Active tech stack parsed from profile</p>
              </div>
              <button
                onClick={() => navigate("/profile")}
                className="text-orange-500 hover:text-orange-600 dark:hover:text-orange-400 text-xs font-bold transition-colors"
              >
                Edit Skills →
              </button>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {profile.skills.map((skill, i) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="bg-orange-500/5 dark:bg-orange-500/10 border border-orange-500/20 dark:border-orange-500/30 text-orange-600 dark:text-orange-400 px-3.5 py-1.5 rounded-2xl text-xs font-bold hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 dark:hover:text-white transition-all cursor-default"
                >
                  ⚡ {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;