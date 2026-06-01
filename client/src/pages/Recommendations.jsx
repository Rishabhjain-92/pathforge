import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Zap, ArrowRight, Code, 
  MessageSquare, AlertTriangle, PlayCircle,
  Award, Target, BookOpen, Star, 
  Sparkles, Clock, ExternalLink, ChevronRight, 
  Lightbulb, Rocket, GraduationCap, Layers,
  RefreshCw, AlertCircle, Briefcase, Shield,
  Terminal, Wrench, Brain, TrendingUp
} from "lucide-react";
import toast from "react-hot-toast";

// ─── Tab Button Component ───
const TabButton = ({ active, icon: Icon, label, count, onClick }) => (
  <button onClick={onClick}
    className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${
      active
        ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
        : "bg-white/50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 border border-gray-200/60 dark:border-gray-700/60 hover:border-orange-500/40 hover:text-orange-500"
    }`}
  >
    <Icon size={16} />
    {label}
    {count > 0 && (
      <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold ${
        active ? "bg-white/20 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
      }`}>{count}</span>
    )}
  </button>
);

// ─── Difficulty Badge ───
const DifficultyBadge = ({ level }) => {
  const style = {
    beginner: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    intermediate: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    advanced: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  }[level?.toLowerCase()] || "bg-gray-500/10 text-gray-500 border-gray-500/20";
  
  return (
    <span className={`px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider border rounded-lg ${style}`}>
      {level}
    </span>
  );
};

// ─── Platform Badge ───
const PlatformBadge = ({ platform }) => {
  const colors = {
    youtube: "bg-red-500/10 text-red-500",
    coursera: "bg-blue-600/10 text-blue-600 dark:text-blue-400",
    udemy: "bg-purple-500/10 text-purple-500",
    leetcode: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    freecodecamp: "bg-green-600/10 text-green-600 dark:text-green-400",
    docs: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
  };
  const style = colors[platform?.toLowerCase()] || "bg-gray-500/10 text-gray-500";
  return (
    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${style}`}>
      {platform}
    </span>
  );
};

// ─── Interview Category Icon ───
const getCategoryIcon = (category) => {
  switch (category?.toLowerCase()) {
    case "technical": return <Terminal size={18} />;
    case "behavioral": return <MessageSquare size={18} />;
    case "system design": return <Brain size={18} />;
    case "resume": return <Briefcase size={18} />;
    default: return <Lightbulb size={18} />;
  }
};

const getCategoryColor = (category) => {
  switch (category?.toLowerCase()) {
    case "technical": return { bg: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-500/20", gradient: "from-blue-500 to-cyan-500" };
    case "behavioral": return { bg: "bg-violet-500/10", text: "text-violet-500", border: "border-violet-500/20", gradient: "from-violet-500 to-purple-500" };
    case "system design": return { bg: "bg-orange-500/10", text: "text-orange-500", border: "border-orange-500/20", gradient: "from-orange-500 to-rose-500" };
    case "resume": return { bg: "bg-emerald-500/10", text: "text-emerald-500", border: "border-emerald-500/20", gradient: "from-emerald-500 to-teal-500" };
    default: return { bg: "bg-gray-500/10", text: "text-gray-500", border: "border-gray-500/20", gradient: "from-gray-500 to-gray-600" };
  }
};


const Recommendations = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState(null);
  const [context, setContext] = useState(null);
  const [generatedAt, setGeneratedAt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("projects");
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "/api/ai/recommendations",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.recommendations) {
        setRecommendations(res.data.recommendations);
        setContext(res.data.context);
        setGeneratedAt(res.data.generatedAt);
      }
    } catch (error) {
      console.error("Failed to fetch recommendations:", error);
    } finally {
      setFetching(false);
    }
  };

  const generateRecommendations = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "/api/ai/generate-recommendations",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRecommendations(res.data.recommendations);
      setContext(res.data.context);
      setGeneratedAt(res.data.generatedAt);
      toast.success("AI Recommendations generated! 🚀", {
        style: {
          borderRadius: "16px",
          background: "rgba(17, 24, 39, 0.9)",
          color: "#fff",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(249, 115, 22, 0.2)"
        }
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate. Please update your profile first.");
    } finally {
      setLoading(false);
    }
  };

  // Smart Sync: detect outdated recommendations
  const isOutdated = () => {
    if (!context || !user) return false;
    return (
      context.targetRole !== (user.targetRole || "") ||
      context.targetCompany !== (user.targetCompany || "") ||
      context.skillsCount !== (user.skills?.length || 0)
    );
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  };

  // ─── Loading: Generation ───
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6">
        <div className="relative">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 border-4 border-orange-500/15 border-t-orange-500 rounded-full" />
          <motion.div animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }} transition={{ duration: 2.5, repeat: Infinity }}
            className="absolute inset-0 flex items-center justify-center">
            <Sparkles size={32} className="text-orange-500" />
          </motion.div>
        </div>
        <div className="text-center max-w-sm">
          <h3 className="text-gray-900 dark:text-white text-xl font-extrabold mb-2">AI is analyzing your profile...</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm animate-pulse leading-relaxed">
            Crafting personalized projects, courses, and interview strategies just for you
          </p>
        </div>
        <div className="flex gap-3 mt-2">
          {["Projects", "Courses", "Strategies"].map((s, i) => (
            <motion.span key={s} initial={{ opacity: 0 }} animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ delay: i * 0.4, duration: 1.5, repeat: Infinity }}
              className="text-[10px] font-bold uppercase tracking-wider text-orange-500/60 bg-orange-500/5 px-3 py-1 rounded-full">
              {s}
            </motion.span>
          ))}
        </div>
      </div>
    );
  }

  // ─── Loading: Fetching ───
  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-3 border-orange-500/20 border-t-orange-500 rounded-full" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pb-10">
      {/* ─── Ambient Blobs ─── */}
      <div className="fixed top-[10%] right-[5%] w-[400px] h-[400px] bg-gradient-to-tr from-orange-500/8 to-rose-500/6 rounded-full blur-[130px] pointer-events-none z-0" />
      <div className="fixed bottom-[15%] left-[3%] w-[350px] h-[350px] bg-gradient-to-br from-violet-500/6 to-blue-500/6 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed top-[55%] right-[35%] w-[200px] h-[200px] bg-gradient-to-bl from-emerald-500/5 to-cyan-500/4 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col gap-6 px-2 mt-4">

        {/* ═══════ Header ═══════ */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="p-2 bg-gradient-to-br from-orange-500/15 to-rose-500/15 rounded-xl">
                <Sparkles size={20} className="text-orange-500" />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-orange-500">AI-Powered Career Coach</span>
            </div>
            <h1 className="text-gray-900 dark:text-white text-3xl font-extrabold tracking-tight">
              Smart Recommendations
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 max-w-lg leading-relaxed">
              Personalized projects, resources & interview strategies to become a <span className="text-orange-500 font-semibold">{user?.targetRole || "professional"}</span>
              {user?.targetCompany ? <> at <span className="text-orange-500 font-semibold">{user.targetCompany}</span></> : null}.
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={generateRecommendations}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-7 py-3 rounded-2xl font-bold shadow-xl shadow-orange-500/25 flex items-center gap-2.5 self-start md:self-auto transition-all text-sm"
          >
            <Zap size={16} className="fill-white/30" />
            {recommendations ? "Regenerate" : "Generate Now"}
            <ArrowRight size={14} />
          </motion.button>
        </div>

        {/* ═══════ Error ═══════ */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-red-500/8 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-2xl flex items-center gap-3 backdrop-blur-md">
              <AlertTriangle size={18} />
              <p className="text-sm font-medium">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══════ Smart Sync Warning ═══════ */}
        <AnimatePresence>
          {recommendations && isOutdated() && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-amber-500/8 border border-amber-500/25 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/15 rounded-xl flex-shrink-0">
                  <AlertCircle size={18} className="text-amber-500" />
                </div>
                <div>
                  <p className="text-amber-700 dark:text-amber-400 text-sm font-bold">Recommendations Outdated</p>
                  <p className="text-amber-600/80 dark:text-amber-500/80 text-xs mt-0.5">Your profile has changed since these were generated. Regenerate for updated results.</p>
                </div>
              </div>
              <button onClick={generateRecommendations}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-amber-500/20 transition-all whitespace-nowrap">
                <RefreshCw size={14} /> Regenerate
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══════ Main Content ═══════ */}
        {recommendations ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
            className="flex flex-col gap-6">

            {/* ─── Missing Skills Banner ─── */}
            {recommendations.missingSkills?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-md border border-white/20 dark:border-gray-800/80 rounded-2xl p-5 shadow-lg shadow-gray-200/5 dark:shadow-none">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="p-1.5 bg-rose-500/10 rounded-lg">
                    <Target size={16} className="text-rose-500" />
                  </div>
                  <h3 className="text-gray-900 dark:text-white text-sm font-bold">Skills Gap Detected</h3>
                  <span className="ml-auto text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    {recommendations.missingSkills.length} missing
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recommendations.missingSkills.map((skill, i) => (
                    <motion.span key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 + i * 0.05 }}
                      className="px-3 py-1.5 bg-rose-500/8 border border-rose-500/15 text-rose-600 dark:text-rose-400 rounded-lg text-xs font-semibold hover:bg-rose-500/15 transition-colors cursor-default">
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ─── Focus Areas ─── */}
            {recommendations.focusAreas?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className="flex flex-wrap gap-3">
                {recommendations.focusAreas.map((area, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.08 }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-orange-500/5 dark:bg-orange-500/8 border border-orange-500/15 rounded-xl hover:bg-orange-500/10 dark:hover:bg-orange-500/15 transition-all group">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full group-hover:scale-150 transition-transform" />
                    <span className="text-gray-700 dark:text-gray-300 text-sm font-semibold">{area}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* ─── Tab Navigation ─── */}
            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
              <TabButton active={activeTab === "projects"} icon={Code} label="Projects" count={recommendations.projects?.length || 0} onClick={() => setActiveTab("projects")} />
              <TabButton active={activeTab === "courses"} icon={GraduationCap} label="Courses" count={recommendations.courses?.length || 0} onClick={() => setActiveTab("courses")} />
              <TabButton active={activeTab === "interview"} icon={Shield} label="Interview Prep" count={recommendations.interviewStrategies?.length || 0} onClick={() => setActiveTab("interview")} />
            </div>

            {/* ─── Tab Content ─── */}
            <AnimatePresence mode="wait">
              
              {/* ═══ Projects Tab ═══ */}
              {activeTab === "projects" && (
                <motion.div key="projects" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {recommendations.projects?.map((project, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                      whileHover={{ y: -6, scale: 1.01 }}
                      className="group bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border border-white/30 dark:border-gray-800/80 rounded-2xl overflow-hidden shadow-xl shadow-gray-200/5 dark:shadow-none transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/5 flex flex-col">
                      
                      {/* Project Number Header */}
                      <div className="bg-gradient-to-r from-orange-500/10 via-rose-500/5 to-transparent p-5 pb-4 border-b border-gray-100 dark:border-gray-800/50">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-rose-500 rounded-xl flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-orange-500/30">
                              {String(i + 1).padStart(2, "0")}
                            </div>
                            <DifficultyBadge level={project.difficulty} />
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500">
                            <Clock size={12} />
                            <span className="text-[11px] font-semibold">{project.estimatedTime}</span>
                          </div>
                        </div>
                        <h3 className="text-gray-900 dark:text-white font-extrabold text-lg leading-snug group-hover:text-orange-500 transition-colors">
                          {project.title}
                        </h3>
                      </div>

                      {/* Project Body */}
                      <div className="p-5 flex flex-col flex-1">
                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4">
                          {project.description}
                        </p>

                        {/* Tech Stack */}
                        <div className="mb-4">
                          <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">Tech Stack</p>
                          <div className="flex flex-wrap gap-1.5">
                            {project.techStack?.map((tech, j) => (
                              <span key={j} className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg text-[11px] font-bold border border-gray-200/50 dark:border-gray-700/50">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Why Build */}
                        <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-800/50">
                          <div className="flex items-start gap-2 bg-emerald-500/5 dark:bg-emerald-500/8 p-3 rounded-xl border border-emerald-500/10">
                            <Lightbulb size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                            <p className="text-emerald-700 dark:text-emerald-400 text-xs leading-relaxed font-medium">{project.whyBuild}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* ═══ Courses Tab ═══ */}
              {activeTab === "courses" && (
                <motion.div key="courses" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}
                  className="flex flex-col gap-4">
                  {recommendations.courses?.map((course, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                      whileHover={{ x: 4 }}
                      className="group bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border border-white/30 dark:border-gray-800/80 rounded-2xl p-5 shadow-lg shadow-gray-200/5 dark:shadow-none transition-all duration-300 hover:border-orange-500/30 dark:hover:border-orange-500/30">
                      
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                        {/* Icon */}
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500/10 to-violet-500/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          <GraduationCap size={22} className="text-blue-500" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <h3 className="text-gray-900 dark:text-white font-bold text-base group-hover:text-orange-500 transition-colors">
                              {course.title}
                            </h3>
                            <PlatformBadge platform={course.platform} />
                            <DifficultyBadge level={course.difficulty} />
                          </div>
                          <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">{course.description}</p>
                          
                          {/* Skills Covered */}
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {course.skillsCovered?.map((skill, j) => (
                              <span key={j} className="px-2 py-0.5 bg-blue-500/8 text-blue-600 dark:text-blue-400 rounded-md text-[10px] font-bold border border-blue-500/10">
                                {skill}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-gray-400">
                              <Clock size={12} />
                              <span className="text-xs font-semibold">{course.estimatedTime}</span>
                            </div>
                            <a href={course.link || "#"} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-orange-500 hover:text-orange-600 font-bold text-xs group-hover:gap-2.5 transition-all">
                              Start Learning <ExternalLink size={12} />
                            </a>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* ═══ Interview Strategies Tab ═══ */}
              {activeTab === "interview" && (
                <motion.div key="interview" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {recommendations.interviewStrategies?.map((strategy, i) => {
                    const catStyle = getCategoryColor(strategy.category);
                    return (
                      <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                        whileHover={{ y: -4 }}
                        className="group bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border border-white/30 dark:border-gray-800/80 rounded-2xl overflow-hidden shadow-xl shadow-gray-200/5 dark:shadow-none transition-all duration-300 flex flex-col">
                        
                        {/* Gradient top bar */}
                        <div className={`h-1 bg-gradient-to-r ${catStyle.gradient}`} />

                        <div className="p-5 flex flex-col flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div className={`p-2.5 ${catStyle.bg} rounded-xl ${catStyle.text} group-hover:scale-110 transition-transform`}>
                              {getCategoryIcon(strategy.category)}
                            </div>
                            <span className={`px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider rounded-lg border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}>
                              {strategy.category}
                            </span>
                          </div>

                          <h3 className="text-gray-900 dark:text-white font-bold text-base mb-2.5 leading-snug">
                            {strategy.title}
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed flex-1">
                            {strategy.description}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ─── Footer Info ─── */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-200/50 dark:border-gray-800/50">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {generatedAt ? `Generated on ${formatDate(generatedAt)}` : ""} • Powered by Groq AI
              </p>
              <button onClick={generateRecommendations}
                className="flex items-center gap-1.5 text-sm font-semibold text-gray-400 dark:text-gray-500 hover:text-orange-500 dark:hover:text-orange-400 transition-colors py-1.5 px-3 rounded-xl hover:bg-orange-500/5">
                <RefreshCw size={13} /> Not happy? Regenerate
              </button>
            </motion.div>

          </motion.div>
        ) : (
          /* ═══════ Empty State ═══════ */
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-800 rounded-3xl shadow-2xl shadow-gray-200/10 dark:shadow-none relative overflow-hidden"
          >
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-8 left-8 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl" />
              <div className="absolute bottom-8 right-8 w-36 h-36 bg-violet-500/5 rounded-full blur-2xl" />
            </div>

            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="relative mb-8">
              <div className="w-28 h-28 bg-gradient-to-br from-orange-500/20 via-rose-500/15 to-violet-500/10 rounded-3xl flex items-center justify-center rotate-6 shadow-xl shadow-orange-500/10">
                <div className="w-22 h-22 bg-gradient-to-br from-orange-500/25 to-rose-500/20 rounded-2xl flex items-center justify-center -rotate-3">
                  <Sparkles size={40} className="text-orange-500" />
                </div>
              </div>
            </motion.div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mb-3 text-center tracking-tight relative z-10">
              Your AI Career Coach Awaits
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-4 text-sm leading-relaxed relative z-10">
              Get personalized project ideas, curated courses, and interview strategies — all powered by AI analysis of your profile.
            </p>

            {/* Feature previews */}
            <div className="flex flex-wrap justify-center gap-3 mb-10 relative z-10">
              {[
                { icon: Code, text: "Portfolio Projects" },
                { icon: GraduationCap, text: "Curated Courses" },
                { icon: Shield, text: "Interview Prep" },
              ].map((feat, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100/60 dark:bg-gray-800/40 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                  <feat.icon size={14} className="text-orange-500" />
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">{feat.text}</span>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 relative z-10">
              <motion.button whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }} onClick={generateRecommendations}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3.5 rounded-2xl font-bold shadow-xl shadow-orange-500/30 flex items-center gap-2.5 transition-all">
                <Sparkles size={18} className="fill-white/20" /> Generate Action Plan
              </motion.button>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => navigate("/profile")}
                className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3.5 rounded-2xl font-semibold flex items-center gap-2 border border-gray-200 dark:border-gray-700 transition-colors text-sm">
                Update Profile First <ArrowRight size={14} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Recommendations;