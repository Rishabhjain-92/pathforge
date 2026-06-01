import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  PieChart, Pie, Cell, BarChart, Bar
} from "recharts";
import {
  TrendingUp, Target, Award, Clock, Activity, Code, Terminal,
  Sparkles, Zap, BookOpen, CheckCircle, ArrowUpRight,
  BarChart3, PieChart as PieIcon, Hexagon, Layers, Star
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

// ─── Custom Tooltip ───
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900/90 backdrop-blur-md border border-gray-700/50 px-4 py-3 rounded-xl shadow-xl">
      <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">{label}</p>
      <p className="text-white text-lg font-extrabold">{payload[0].value}%</p>
    </div>
  );
};

// ─── Stat Card ───
const StatCard = ({ label, value, icon: Icon, color, bg, trend, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ y: -4, scale: 1.01 }}
    className="group bg-white/50 dark:bg-gray-900/50 backdrop-blur-md border border-white/20 dark:border-gray-800/80 rounded-2xl p-5 shadow-lg shadow-gray-200/5 dark:shadow-none transition-all duration-300 hover:shadow-xl hover:border-orange-500/20"
  >
    <div className="flex items-center justify-between mb-3">
      <span className="text-gray-400 dark:text-gray-500 text-[10px] font-bold uppercase tracking-wider">{label}</span>
      <div className={`${bg} p-2 rounded-xl group-hover:scale-110 transition-transform`}>
        <Icon size={16} className={color} />
      </div>
    </div>
    <div className="flex items-end gap-2">
      <p className="text-gray-900 dark:text-white text-3xl font-extrabold tracking-tight">{value}</p>
      {trend && (
        <span className="flex items-center gap-0.5 text-emerald-500 text-xs font-bold mb-1">
          <ArrowUpRight size={12} /> {trend}
        </span>
      )}
    </div>
  </motion.div>
);

const Analytics = () => {
  const { user } = useAuth();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/user/analytics", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAnalyticsData(res.data);
      } catch (err) {
        console.error("Failed to fetch analytics data");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const readinessScore = user?.readinessScore || 0;
  const roadmapProgress = user?.roadmapProgress || 0;
  const totalSkills = user?.skills?.length || 0;

  const progressData = analyticsData?.progressData || [];
  const skillDomains = analyticsData?.skillDomains || [];

  // Calculate days on platform
  const getDaysOnPlatform = () => {
    if (!user?.createdAt) return 1;
    const created = new Date(user.createdAt);
    const now = new Date();
    return Math.max(1, Math.floor((now - created) / (1000 * 60 * 60 * 24)));
  };

  // Readiness Donut
  const readinessData = [
    { name: "Matched", value: readinessScore, color: "#F97316" },
    { name: "Gap", value: 100 - readinessScore, color: "#1F2937" },
  ];

  // Skills Distribution Bar
  const skillBarData = (user?.skills || []).slice(0, 8).map((skill, i) => ({
    name: skill.length > 10 ? skill.substring(0, 10) + "…" : skill,
    proficiency: Math.max(30, Math.min(95, 50 + Math.sin(i * 1.5) * 30 + readinessScore * 0.3)),
  }));

  // Activity Timeline
  const activities = [
    { text: "Profile created", time: `${getDaysOnPlatform()} day(s) ago`, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { text: "Skills updated", time: `${totalSkills} skills added`, icon: Code, color: "text-blue-500", bg: "bg-blue-500/10" },
    { text: user?.resumeFileName ? "Resume uploaded" : "Resume pending", time: user?.resumeFileName || "Not uploaded", icon: BookOpen, color: user?.resumeFileName ? "text-orange-500" : "text-gray-400", bg: user?.resumeFileName ? "bg-orange-500/10" : "bg-gray-500/10" },
    { text: readinessScore > 0 ? "ATS Analysis done" : "ATS Analysis pending", time: readinessScore > 0 ? `Score: ${readinessScore}%` : "Analyze your resume", icon: Star, color: readinessScore > 0 ? "text-violet-500" : "text-gray-400", bg: readinessScore > 0 ? "bg-violet-500/10" : "bg-gray-500/10" },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-14 h-14 border-4 border-orange-500/15 border-t-orange-500 rounded-full" />
        <p className="text-gray-400 text-sm font-medium animate-pulse">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pb-10">
      {/* ─── Ambient Blobs ─── */}
      <div className="fixed top-[8%] right-[5%] w-[400px] h-[400px] bg-gradient-to-tr from-violet-500/8 to-indigo-500/5 rounded-full blur-[130px] pointer-events-none z-0" />
      <div className="fixed bottom-[10%] left-[3%] w-[350px] h-[350px] bg-gradient-to-br from-orange-500/8 to-rose-500/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed top-[50%] left-[40%] w-[200px] h-[200px] bg-gradient-to-bl from-emerald-500/4 to-cyan-500/3 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col gap-6 px-2 mt-4">

        {/* ═══════ Header ═══════ */}
        <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="p-2 bg-gradient-to-br from-violet-500/15 to-indigo-500/15 rounded-xl">
              <BarChart3 size={20} className="text-violet-500" />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-violet-500">Data Dashboard</span>
          </div>
          <h1 className="text-gray-900 dark:text-white text-3xl font-extrabold tracking-tight">
            Career Analytics
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 max-w-lg leading-relaxed">
            Data-driven insights into your preparation journey for <span className="text-orange-500 font-semibold">{user?.targetRole || "your dream role"}</span>.
          </p>
        </motion.div>

        {/* ═══════ Stats Row ═══════ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Overall Readiness" value={`${readinessScore}%`} icon={Target} color="text-orange-500" bg="bg-orange-500/10" trend="+2.5%" delay={0.05} />
          <StatCard label="Roadmap Progress" value={`${roadmapProgress}%`} icon={TrendingUp} color="text-emerald-500" bg="bg-emerald-500/10" delay={0.1} />
          <StatCard label="Skills Mastered" value={totalSkills} icon={Layers} color="text-blue-500" bg="bg-blue-500/10" trend={totalSkills > 0 ? `+${totalSkills}` : null} delay={0.15} />
          <StatCard label="Days Active" value={getDaysOnPlatform()} icon={Clock} color="text-violet-500" bg="bg-violet-500/10" delay={0.2} />
        </div>

        {/* ═══════ Main Charts Grid ═══════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* ─── Progress Trend (Area Chart) ─── */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="lg:col-span-8 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md border border-white/20 dark:border-gray-800/80 rounded-2xl p-6 shadow-xl shadow-gray-200/5 dark:shadow-none">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-orange-500/10 rounded-xl">
                  <TrendingUp size={16} className="text-orange-500" />
                </div>
                <div>
                  <h2 className="text-gray-900 dark:text-white text-base font-bold">Progress Trend</h2>
                  <p className="text-gray-400 dark:text-gray-500 text-[10px] font-bold uppercase tracking-wider mt-0.5">Last 7 days</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-extrabold rounded-lg border border-emerald-500/20">
                LIVE
              </span>
            </div>
            <div className="h-[280px] w-full">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={progressData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gradProgress" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#F97316" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#F97316" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(107, 114, 128, 0.08)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9CA3AF", fontWeight: 600 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} domain={[0, 100]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="progress" stroke="#F97316" strokeWidth={3} fillOpacity={1} fill="url(#gradProgress)"
                      dot={{ fill: "#F97316", strokeWidth: 2, stroke: "#fff", r: 4 }}
                      activeDot={{ r: 6, fill: "#F97316", stroke: "#fff", strokeWidth: 3 }} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </motion.div>

          {/* ─── Readiness Donut ─── */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="lg:col-span-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md border border-white/20 dark:border-gray-800/80 rounded-2xl p-6 shadow-xl shadow-gray-200/5 dark:shadow-none flex flex-col">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 bg-orange-500/10 rounded-xl">
                <PieIcon size={16} className="text-orange-500" />
              </div>
              <h2 className="text-gray-900 dark:text-white text-base font-bold">Readiness Score</h2>
            </div>
            <div className="flex-1 flex items-center justify-center relative min-h-[220px]">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={readinessData} cx="50%" cy="50%" innerRadius={65} outerRadius={85} paddingAngle={4} dataKey="value" stroke="none" startAngle={90} endAngle={-270}>
                      {readinessData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: "spring" }}
                  className="text-4xl font-extrabold text-gray-900 dark:text-white">{readinessScore}%</motion.span>
                <span className="text-[10px] font-extrabold text-orange-500 uppercase tracking-[0.2em] mt-1">Ready</span>
              </div>
            </div>
            <div className="flex justify-around mt-4 pt-4 border-t border-gray-100 dark:border-gray-800/50">
              <div className="text-center">
                <div className="flex items-center gap-1.5 justify-center mb-1">
                  <div className="w-2.5 h-2.5 bg-orange-500 rounded-full" />
                  <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">Matched</span>
                </div>
                <p className="text-gray-900 dark:text-white text-lg font-extrabold">{readinessScore}%</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1.5 justify-center mb-1">
                  <div className="w-2.5 h-2.5 bg-gray-700 rounded-full" />
                  <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">Gap</span>
                </div>
                <p className="text-gray-900 dark:text-white text-lg font-extrabold">{100 - readinessScore}%</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ═══════ Second Row ═══════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ─── Skill Radar ─── */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="lg:col-span-5 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md border border-white/20 dark:border-gray-800/80 rounded-2xl p-6 shadow-xl shadow-gray-200/5 dark:shadow-none">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="p-2 bg-violet-500/10 rounded-xl">
                <Hexagon size={16} className="text-violet-500" />
              </div>
              <div>
                <h2 className="text-gray-900 dark:text-white text-base font-bold">Skill Radar</h2>
                <p className="text-gray-400 dark:text-gray-500 text-[10px] font-bold uppercase tracking-wider mt-0.5">Domain proficiency</p>
              </div>
            </div>
            <div className="h-[280px] w-full">
              {mounted && skillDomains.length > 0 && (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillDomains}>
                    <PolarGrid stroke="rgba(107, 114, 128, 0.15)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: "#9CA3AF", fontSize: 11, fontWeight: 600 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Proficiency" dataKey="A" stroke="#8B5CF6" strokeWidth={2} fill="#8B5CF6" fillOpacity={0.2} />
                    <Tooltip contentStyle={{ backgroundColor: "rgba(17, 24, 39, 0.9)", borderRadius: "12px", border: "1px solid rgba(139,92,246,0.2)", color: "#fff" }} />
                  </RadarChart>
                </ResponsiveContainer>
              )}
            </div>
          </motion.div>

          {/* ─── Skills Bar Chart ─── */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="lg:col-span-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md border border-white/20 dark:border-gray-800/80 rounded-2xl p-6 shadow-xl shadow-gray-200/5 dark:shadow-none">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="p-2 bg-blue-500/10 rounded-xl">
                <BarChart3 size={16} className="text-blue-500" />
              </div>
              <div>
                <h2 className="text-gray-900 dark:text-white text-base font-bold">Skill Proficiency</h2>
                <p className="text-gray-400 dark:text-gray-500 text-[10px] font-bold uppercase tracking-wider mt-0.5">Estimated levels</p>
              </div>
            </div>
            {skillBarData.length > 0 ? (
              <div className="h-[280px] w-full">
                {mounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={skillBarData} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="gradBar" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#3B82F6" />
                          <stop offset="100%" stopColor="#8B5CF6" />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(107, 114, 128, 0.08)" />
                      <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#9CA3AF" }} />
                      <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9CA3AF", fontWeight: 600 }} width={80} />
                      <Bar dataKey="proficiency" fill="url(#gradBar)" radius={[0, 6, 6, 0]} barSize={14} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[280px] text-center">
                <Code size={32} className="text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-gray-400 dark:text-gray-500 text-sm font-medium">Add skills in your profile</p>
              </div>
            )}
          </motion.div>

          {/* ─── Activity Timeline ─── */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
            className="lg:col-span-3 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md border border-white/20 dark:border-gray-800/80 rounded-2xl p-6 shadow-xl shadow-gray-200/5 dark:shadow-none">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="p-2 bg-emerald-500/10 rounded-xl">
                <Activity size={16} className="text-emerald-500" />
              </div>
              <h2 className="text-gray-900 dark:text-white text-base font-bold">Activity</h2>
            </div>
            <div className="flex flex-col gap-3">
              {activities.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.08 }}
                  className="flex items-center gap-3 p-3 bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100/50 dark:border-gray-800/40 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className={`${item.bg} p-2 rounded-lg flex-shrink-0`}>
                    <item.icon size={14} className={item.color} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-gray-800 dark:text-gray-200 text-xs font-bold truncate">{item.text}</p>
                    <p className="text-gray-400 dark:text-gray-500 text-[10px] mt-0.5 truncate">{item.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* ═══════ Bottom Row: Skills Showcase ═══════ */}
        {user?.skills?.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
            className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-md border border-white/20 dark:border-gray-800/80 rounded-2xl p-6 shadow-xl shadow-gray-200/5 dark:shadow-none">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-orange-500/10 rounded-xl">
                  <Zap size={16} className="text-orange-500" />
                </div>
                <h2 className="text-gray-900 dark:text-white text-base font-bold">Your Tech Stack</h2>
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{totalSkills} skills</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill, i) => (
                <motion.span key={skill} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 + i * 0.03 }}
                  className="px-3.5 py-1.5 bg-orange-500/5 dark:bg-orange-500/8 border border-orange-500/15 text-orange-600 dark:text-orange-400 rounded-xl text-xs font-bold hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 dark:hover:text-white transition-all cursor-default">
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

export default Analytics;