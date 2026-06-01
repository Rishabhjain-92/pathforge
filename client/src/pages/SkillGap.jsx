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
        "/api/skill-gap",
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
      <div className="flex items-center justify-center h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-7 h-7 border-2 border-orange-500/30 border-t-orange-500 rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <AlertCircle size={40} className="text-red-400" />
        <p className="text-red-400 text-base">{error}</p>
        <button onClick={fetchSkillGap} className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl transition-colors text-sm">
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
    <div className="flex flex-col gap-5 relative">
      <div className="fixed top-[150px] right-[150px] w-[300px] h-[300px] bg-orange-500/5 dark:bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
        <h1 className="text-gray-900 dark:text-white text-2xl font-bold">Skill Gap Analysis</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Compare your skills with {data.targetRole} requirements
          {data.targetCompany && ` at ${data.targetCompany}`}
        </p>
      </motion.div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-4">

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-7 flex flex-col items-center justify-center text-center shadow-sm dark:shadow-none"
        >
          <p className="text-gray-500 dark:text-gray-400 text-xs mb-5 font-medium">Readiness Score</p>

          <div className="relative w-[130px] h-[130px]">
            <svg width="130" height="130" className="-rotate-90">
              <circle cx="65" cy="65" r="52" fill="none" className="stroke-gray-100 dark:stroke-gray-800" strokeWidth="10" />
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
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, type: "spring" }}
                className="text-3xl font-extrabold leading-none" style={{ color: scoreColor }}
              >
                {data.readinessScore}%
              </motion.span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-4 px-3.5 py-1.5 rounded-full text-xs font-bold"
            style={{ backgroundColor: scoreLabel.bg, border: `1px solid ${scoreLabel.border}`, color: scoreLabel.color }}
          >
            {scoreLabel.text}
          </motion.div>

          <p className="text-gray-500 dark:text-gray-400 text-xs mt-2.5">
            {data.totalMatched} of {data.totalRequired} skills matched
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: "Skills You Have", value: data.userSkills.length, colorClass: "text-blue-500", bgClass: "bg-blue-50 dark:bg-blue-500/10", icon: CheckCircle },
            { label: "Skills Matched", value: data.totalMatched, colorClass: "text-green-500", bgClass: "bg-green-50 dark:bg-green-500/10", icon: Target },
            { label: "Skills Missing", value: data.missingSkills.length, colorClass: "text-red-500", bgClass: "bg-red-50 dark:bg-red-500/10", icon: XCircle },
            { label: "Total Required", value: data.totalRequired, colorClass: "text-purple-500", bgClass: "bg-purple-50 dark:bg-purple-500/10", icon: TrendingUp },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 flex items-center gap-3.5 shadow-sm dark:shadow-none"
            >
              <div className={`w-11 h-11 ${stat.bgClass} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <stat.icon size={20} className={stat.colorClass} />
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-xs">{stat.label}</p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className={`${stat.colorClass} text-2xl font-extrabold mt-0.5`}
                >
                  {stat.value}
                </motion.p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4">

        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5.5 shadow-sm dark:shadow-none"
        >
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 bg-green-50 dark:bg-green-500/10 rounded-lg flex items-center justify-center">
              <CheckCircle size={16} className="text-green-500" />
            </div>
            <h3 className="text-gray-900 dark:text-white text-sm font-semibold">
              Current Skills
            </h3>
            <span className="ml-auto bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-600 dark:text-green-500 px-2.5 py-0.5 rounded-full text-xs">
              {data.userSkills.length}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {data.userSkills.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No skills added yet.{" "}
                <span
                  onClick={() => navigate("/profile")}
                  className="text-orange-500 cursor-pointer hover:underline"
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
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${isMatched ? "bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/30 text-green-600 dark:text-green-400" : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"}`}
                  >
                    {isMatched && <CheckCircle size={11} />}
                    {skill}
                  </motion.span>
                );
              })
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5.5 shadow-sm dark:shadow-none"
        >
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 bg-orange-50 dark:bg-orange-500/10 rounded-lg flex items-center justify-center">
              <Target size={16} className="text-orange-500" />
            </div>
            <h3 className="text-gray-900 dark:text-white text-sm font-semibold">
              Required Skills
            </h3>
            <span className="ml-auto bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 text-orange-600 dark:text-orange-500 px-2.5 py-0.5 rounded-full text-xs">
              {data.totalRequired}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
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
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${isMatched ? "bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/30 text-green-600 dark:text-green-400" : "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400"}`}
                >
                  {isMatched ? <CheckCircle size={11} /> : <XCircle size={11} />}
                  {skill}
                </motion.span>
              );
            })}
          </div>
        </motion.div>
      </div>

      {data.missingSkills.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative z-10 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5.5 shadow-sm dark:shadow-none"
        >
          <div className="flex items-center gap-2.5 mb-4.5">
            <div className="w-8 h-8 bg-red-50 dark:bg-red-500/10 rounded-lg flex items-center justify-center">
              <XCircle size={16} className="text-red-500" />
            </div>
            <h3 className="text-gray-900 dark:text-white text-sm font-semibold">
              Skills to Learn
            </h3>
            <span className="text-gray-500 dark:text-gray-400 text-xs ml-1">
              — Priority order
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {data.missingSkills.map((skill, i) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 + i * 0.06 }}
                whileHover={{ x: 4 }}
                className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-xl p-3 border border-gray-100 dark:border-transparent"
              >
                <div className="w-6 h-6 bg-red-50 dark:bg-red-500/10 rounded-md flex items-center justify-center flex-shrink-0">
                  <span className="text-red-500 text-[11px] font-bold">
                    {i + 1}
                  </span>
                </div>
                <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">{skill}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="relative z-10 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5.5 shadow-sm dark:shadow-none"
      >
        <h3 className="text-gray-900 dark:text-white text-sm font-semibold mb-4">
          Skill Match Visualization
        </h3>

        <div className="flex flex-col gap-2.5">
          {data.requiredSkills.map((skill, i) => {
            const isMatched = data.matchedSkills
              .map(s => s.toLowerCase())
              .includes(skill.toLowerCase());
            return (
              <div key={skill}>
                <div className="flex justify-between mb-1.5">
                  <span className={`text-xs ${isMatched ? "text-gray-700 dark:text-gray-300" : "text-gray-500 dark:text-gray-400"}`}>
                    {skill}
                  </span>
                  <span className={`text-xs font-semibold ${isMatched ? "text-green-500" : "text-red-500"}`}>
                    {isMatched ? "✓ Matched" : "✗ Missing"}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: isMatched ? "100%" : "0%" }}
                    transition={{ duration: 0.8, delay: 0.7 + i * 0.04 }}
                    className={`h-full rounded-full ${isMatched ? "bg-green-500" : "bg-red-500"}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-3"
      >
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/roadmap")}
          className="bg-orange-500 hover:bg-orange-600 text-white p-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 transition-colors"
        >
          <Zap size={16} />
          Generate Roadmap to Fill Gaps
          <ArrowRight size={16} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/profile")}
          className="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 text-orange-600 dark:text-orange-500 hover:bg-orange-100 dark:hover:bg-orange-500/20 p-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <BookOpen size={16} />
          Update My Skills
        </motion.button>
      </motion.div>

    </div>
  );
};

export default SkillGap;