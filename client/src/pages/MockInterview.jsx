import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  MessageSquare, Sparkles, Play, Award, Brain,
  ChevronRight, Mic, MicOff, RefreshCw, Star,
  AlertTriangle, CheckCircle, Clock, Send, ChevronDown,
  ChevronUp, ArrowLeft, ShieldAlert, BookOpen, Target, Calendar,
  Zap, Trophy, TrendingUp, Users, Code, BarChart3
} from "lucide-react";
import toast from "react-hot-toast";
import {
  Radar, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from "recharts";

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const MockInterview = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [appState, setAppState] = useState("setup");
  const [role, setRole] = useState(user?.targetRole || "");
  const [company, setCompany] = useState(user?.targetCompany || "");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [interviewType, setInterviewType] = useState("Technical");
  const [interviewId, setInterviewId] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const [scorecard, setScorecard] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const [expandedTranscript, setExpandedTranscript] = useState({});
  const [loadingStepText, setLoadingStepText] = useState("AI Interviewer is analyzing...");
  const analysisTexts = [
    "Parsing answers for core technical syntax...",
    "Assessing conceptual depth and problem solving...",
    "Evaluating verbal communication clarity...",
    "Formatting personalized ideal answers...",
    "Calibrating overall performance analytics...",
  ];

  useEffect(() => {
    if (user) {
      if (!role) setRole(user.targetRole || "");
      if (!company) setCompany(user.targetCompany || "");
    }
  }, [user]);

  useEffect(() => { fetchHistory(); }, []);

  useEffect(() => {
    if (appState === "active") {
      timerRef.current = setInterval(() => setSecondsElapsed((p) => p + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setSecondsElapsed(0);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [appState]);

  useEffect(() => {
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = false;
      rec.lang = "en-US";
      rec.onresult = (e) => {
        const text = Array.from(e.results).map((r) => r[0].transcript).join("");
        setAnswer((prev) => (prev ? prev + " " + text : text));
      };
      rec.onerror = () => { setIsListening(false); toast.error("Mic issue — continue typing!"); };
      rec.onend = () => setIsListening(false);
      recognitionRef.current = rec;
    }
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/interview/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(res.data.history);
    } catch { /* silent */ } finally { setLoadingHistory(false); }
  };

  const startNewInterviewSession = async (e) => {
    e.preventDefault();
    if (!role.trim() || !company.trim()) return toast.error("Please fill in both Role and Company!");
    setLoadingAction(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "/api/interview/start",
        { role, company, difficulty, type: interviewType },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInterviewId(res.data.interviewId);
      setQuestions([{ question: res.data.question, answer: "", evaluation: "", score: 0 }]);
      setCurrentIndex(0);
      setAnswer("");
      setAppState("active");
      toast.success("Interview started! Speak or type your answer. 🎙️");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to start interview.");
    } finally { setLoadingAction(false); }
  };

  const toggleMicListening = () => {
    if (!SpeechRecognition) return toast.error("Speech not supported — please type!");
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try { recognitionRef.current.start(); setIsListening(true); toast.success("Listening..."); }
      catch (e) { console.error(e); }
    }
  };

  const handleAnswerSubmit = async () => {
    if (!answer.trim()) return toast.error("Please write or speak an answer first.");
    if (isListening) { recognitionRef.current.stop(); setIsListening(false); }
    setLoadingAction(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "/api/interview/submit",
        { interviewId, answer },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updated = [...questions];
      updated[currentIndex].answer = answer;
      updated[currentIndex].score = res.data.score;
      updated[currentIndex].evaluation = res.data.evaluation;
      if (res.data.completed) {
        setAppState("loading_feedback");
        let idx = 0;
        const ti = setInterval(() => {
          if (idx < analysisTexts.length) { setLoadingStepText(analysisTexts[idx]); idx++; }
          else clearInterval(ti);
        }, 1500);
        const feedbackRes = await axios.get(
          `/api/interview/feedback/${interviewId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        clearInterval(ti);
        setScorecard(feedbackRes.data.interview);
        setAppState("feedback");
        toast.success("AI Scorecard ready! 🏆");
        fetchHistory();
      } else {
        updated.push({ question: res.data.nextQuestion, answer: "", evaluation: "", score: 0 });
        setQuestions(updated);
        setCurrentIndex(res.data.currentIndex);
        setAnswer("");
        toast.success("Response saved. Next question! ➡️");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit answer.");
    } finally { setLoadingAction(false); }
  };

  const viewPastInterviewDetails = async (id) => {
    setLoadingAction(true);
    setAppState("loading_feedback");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`/api/interview/feedback/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setScorecard(res.data.interview);
      setAppState("feedback");
    } catch { toast.error("Failed to load interview report."); setAppState("setup"); }
    finally { setLoadingAction(false); }
  };

  const toggleAccordion = (idx) =>
    setExpandedTranscript((prev) => ({ ...prev, [idx]: !prev[idx] }));

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const getScoreMeta = (score) => {
    if (score >= 75) return { color: "text-emerald-400", border: "border-emerald-500/30", bg: "bg-emerald-500/10", label: "Strong" };
    if (score >= 50) return { color: "text-amber-400", border: "border-amber-500/30", bg: "bg-amber-500/10", label: "Good" };
    return { color: "text-rose-400", border: "border-rose-500/30", bg: "bg-rose-500/10", label: "Needs Work" };
  };

  const difficultyColors = {
    Beginner: "bg-emerald-500 border-emerald-500 shadow-emerald-500/25",
    Intermediate: "bg-amber-500 border-amber-500 shadow-amber-500/25",
    Advanced: "bg-rose-500 border-rose-500 shadow-rose-500/25",
  };

  return (
    <div className="relative min-h-screen">
      {/* Ambient blobs */}
      <div className="fixed top-[5%] right-[5%] w-[500px] h-[500px] bg-gradient-to-br from-orange-500/6 to-rose-500/4 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-[10%] left-[3%] w-[400px] h-[400px] bg-gradient-to-tr from-violet-500/5 to-indigo-500/4 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-6xl mx-auto space-y-7">

        {/* ═══════ HEADER ═══════ */}
        <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2.5 bg-gradient-to-br from-orange-500/20 to-rose-500/15 rounded-2xl border border-orange-500/20">
                <Brain size={22} className="text-orange-500" />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-orange-500">AI Interview Room</span>
            </div>
            <h1 className="text-gray-900 dark:text-white text-3xl font-extrabold tracking-tight">
              Mock Interview
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Simulated corporate-grade technical & behavioral rounds powered by Groq Llama-3.3 70B.
            </p>
          </div>
          {appState === "feedback" && (
            <motion.button initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
              onClick={() => setAppState("setup")}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl font-bold border border-gray-200/80 dark:border-gray-700/60 transition-all text-sm shadow-md">
              <ArrowLeft size={16} /> Back to Setup
            </motion.button>
          )}
        </motion.div>

        <AnimatePresence mode="wait">

          {/* ─── 1. SETUP ─── */}
          {appState === "setup" && (
            <motion.div key="setup"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-5 gap-7">

              {/* Setup Form */}
              <div className="lg:col-span-2 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/30 dark:border-gray-800/70 rounded-3xl shadow-2xl shadow-gray-200/10 dark:shadow-none overflow-hidden">
                {/* Card top accent */}
                <div className="h-1 bg-gradient-to-r from-orange-500 via-rose-500 to-orange-400" />
                <div className="p-6 flex flex-col gap-6">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-orange-500/10 rounded-xl"><Sparkles size={16} className="text-orange-500" /></div>
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-orange-500">Configure Session</span>
                  </div>

                  <form onSubmit={startNewInterviewSession} className="space-y-5">
                    {/* Role */}
                    <div>
                      <label className="block text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Target Role</label>
                      <input type="text" placeholder="e.g., Frontend Developer"
                        value={role} onChange={(e) => setRole(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 text-sm font-semibold transition-all text-gray-900 dark:text-white placeholder-gray-400"
                        required />
                    </div>

                    {/* Company */}
                    <div>
                      <label className="block text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Target Company</label>
                      <input type="text" placeholder="e.g., Google"
                        value={company} onChange={(e) => setCompany(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 text-sm font-semibold transition-all text-gray-900 dark:text-white placeholder-gray-400"
                        required />
                    </div>

                    {/* Difficulty */}
                    <div>
                      <label className="block text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2.5">Difficulty</label>
                      <div className="grid grid-cols-3 gap-2">
                        {["Beginner", "Intermediate", "Advanced"].map((level) => (
                          <button key={level} type="button" onClick={() => setDifficulty(level)}
                            className={`py-2.5 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${
                              difficulty === level
                                ? `${difficultyColors[level]} text-white shadow-md`
                                : "bg-transparent border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-orange-500/50"
                            }`}>
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Type */}
                    <div>
                      <label className="block text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2.5">Round Type</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: "Technical", icon: Code },
                          { id: "Behavioral", icon: Users },
                        ].map(({ id, icon: Icon }) => (
                          <button key={id} type="button" onClick={() => setInterviewType(id)}
                            className={`py-3 rounded-xl text-xs font-bold border-2 flex items-center justify-center gap-2 transition-all cursor-pointer ${
                              interviewType === id
                                ? "bg-violet-500 border-violet-500 text-white shadow-md shadow-violet-500/25"
                                : "bg-transparent border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-violet-500/50"
                            }`}>
                            <Icon size={14} /> {id}
                          </button>
                        ))}
                      </div>
                    </div>

                    <motion.button type="submit" disabled={loadingAction}
                      whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}
                      className="w-full py-4 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-extrabold rounded-2xl shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2.5 mt-2 disabled:opacity-60">
                      {loadingAction
                        ? <><RefreshCw size={18} className="animate-spin" /> Initializing...</>
                        : <><Play size={18} fill="white" /> Start Interview</>}
                    </motion.button>
                  </form>

                  <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wider pt-1 border-t border-gray-100 dark:border-gray-800/60">
                    <ShieldAlert size={11} /> Groq Llama-3.3 70B · End-to-end AI
                  </div>
                </div>
              </div>

              {/* History Panel */}
              <div className="lg:col-span-3 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <Clock size={16} className="text-orange-500" /> Interview History
                  </h3>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{history.length} sessions</span>
                </div>

                {loadingHistory ? (
                  <div className="bg-white/50 dark:bg-gray-900/40 border border-gray-200/50 dark:border-gray-800/50 rounded-2xl h-72 flex items-center justify-center">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                      className="w-8 h-8 border-2 border-orange-500/20 border-t-orange-500 rounded-full" />
                  </div>
                ) : history.length === 0 ? (
                  <div className="bg-white/50 dark:bg-gray-900/40 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl p-16 text-center flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500/10 to-rose-500/10 rounded-2xl flex items-center justify-center">
                      <MessageSquare size={28} className="text-orange-500/50" />
                    </div>
                    <div>
                      <h4 className="text-gray-700 dark:text-gray-300 font-bold text-sm">No sessions yet</h4>
                      <p className="text-xs text-gray-400 mt-1 max-w-[240px]">Configure your session on the left and launch your first AI interview!</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[560px] overflow-y-auto pr-1">
                    {history.map((session, i) => {
                      const meta = session.overallScore ? getScoreMeta(session.overallScore) : null;
                      return (
                        <motion.div key={session._id}
                          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                          className="bg-white/70 dark:bg-gray-900/60 backdrop-blur-md border border-gray-200/60 dark:border-gray-800/60 rounded-2xl p-5 hover:border-orange-500/40 hover:shadow-lg hover:shadow-orange-500/5 transition-all group flex flex-col justify-between">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase border ${
                                session.type === "Technical"
                                  ? "bg-blue-500/10 border-blue-500/20 text-blue-500"
                                  : "bg-violet-500/10 border-violet-500/20 text-violet-500"
                              }`}>
                                {session.type}
                              </span>
                              <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                                <Calendar size={11} />
                                {new Date(session.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                              </span>
                            </div>
                            <div>
                              <h4 className="text-sm font-extrabold text-gray-800 dark:text-gray-200 truncate">{session.role}</h4>
                              <p className="text-[11px] font-semibold text-gray-400 mt-0.5">at {session.company} · {session.difficulty}</p>
                            </div>
                          </div>

                          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800/60 flex items-center justify-between">
                            {session.status === "completed" && meta ? (
                              <div className="flex items-center gap-2">
                                <span className={`text-2xl font-black ${meta.color}`}>{session.overallScore}</span>
                                <div>
                                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${meta.bg} ${meta.border} ${meta.color}`}>{meta.label}</span>
                                  <p className="text-[9px] text-gray-400 mt-0.5">/ 100</p>
                                </div>
                              </div>
                            ) : (
                              <span className="text-xs font-extrabold text-amber-500 flex items-center gap-1 animate-pulse">
                                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping" /> In Progress
                              </span>
                            )}
                            <button onClick={() => viewPastInterviewDetails(session._id)}
                              className="px-3.5 py-1.5 bg-gray-50 dark:bg-gray-800/80 hover:bg-orange-500 dark:hover:bg-orange-500 text-gray-600 dark:text-gray-300 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 border border-gray-200 dark:border-gray-700 hover:border-orange-500">
                              {session.status === "completed" ? "View Report" : "Resume"} <ChevronRight size={13} />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ─── 2. ACTIVE INTERVIEW ─── */}
          {appState === "active" && (
            <motion.div key="active"
              initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-4xl mx-auto space-y-5">

              {/* Session Bar */}
              <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-gray-200/60 dark:border-gray-800/60 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-rose-500/10 rounded-xl"><Target size={16} className="text-rose-500" /></div>
                  <div>
                    <h4 className="text-sm font-extrabold text-gray-800 dark:text-white">{role} @ {company}</h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{difficulty} · {interviewType} Round</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-gray-800/60 border border-gray-200/40 dark:border-gray-700/40 rounded-xl font-mono text-xs font-bold text-gray-600 dark:text-gray-300">
                    <Clock size={13} className="text-orange-500" /> {formatTimer(secondsElapsed)}
                  </div>
                  {/* Progress dots */}
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        i < currentIndex ? "bg-emerald-500" : i === currentIndex ? "bg-orange-500 ring-2 ring-orange-500/30" : "bg-gray-200 dark:bg-gray-700"
                      }`} />
                    ))}
                  </div>
                  <span className="text-xs font-extrabold text-gray-400 dark:text-gray-500">Q{currentIndex + 1}/5</span>
                </div>
              </div>

              {/* Main Card */}
              <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-gray-200/60 dark:border-gray-800/60 rounded-3xl shadow-2xl overflow-hidden">
                <div className="h-0.5 bg-gradient-to-r from-orange-500 via-rose-500 to-orange-400" />
                <div className="p-7 space-y-6">

                  {/* Question */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-extrabold text-orange-500 uppercase tracking-widest">
                      <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                      AI Interviewer
                    </div>
                    <div className="bg-gradient-to-br from-orange-500/5 to-rose-500/5 border border-orange-500/15 p-5 rounded-2xl">
                      <p className="text-base md:text-lg font-bold text-gray-800 dark:text-gray-100 leading-relaxed">
                        {questions[currentIndex]?.question}
                      </p>
                    </div>
                  </div>

                  {/* Answer */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        Your Response
                        {isListening && (
                          <span className="flex items-center gap-1 text-rose-500 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full animate-pulse">
                            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping" /> Listening
                          </span>
                        )}
                      </label>
                      <span className="text-[10px] font-bold text-gray-400">
                        {answer.split(/\s+/).filter(Boolean).length} words
                      </span>
                    </div>
                    <div className="relative">
                      <textarea
                        placeholder="Type your answer here, or click the mic to speak..."
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        rows={6}
                        className="w-full p-5 rounded-2xl bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/60 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 font-semibold text-sm leading-relaxed resize-none text-gray-800 dark:text-gray-200 placeholder-gray-400 transition-all"
                      />
                      <button onClick={toggleMicListening} type="button"
                        className={`absolute bottom-4 right-4 p-3 rounded-full border-2 transition-all cursor-pointer shadow-lg ${
                          isListening
                            ? "bg-rose-500 border-rose-500 text-white shadow-rose-500/30 animate-pulse"
                            : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-orange-500 hover:text-orange-500"
                        }`}
                        title={isListening ? "Stop" : "Speak"}>
                        {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Bar */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800/50">
                    <p className="text-xs text-gray-400 max-w-xs hidden md:block">
                      💡 Tip: Elaborate on your thought process and mention trade-offs.
                    </p>
                    <motion.button onClick={handleAnswerSubmit} disabled={loadingAction}
                      whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }}
                      className="px-7 py-3.5 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-extrabold rounded-2xl shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 transition-all flex items-center gap-2.5 text-sm disabled:opacity-60 ml-auto">
                      {loadingAction ? <><RefreshCw size={16} className="animate-spin" /> Analyzing...</> : <>Submit & Next <Send size={15} /></>}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── 3. LOADING ─── */}
          {appState === "loading_feedback" && (
            <motion.div key="loading"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-[65vh] gap-8">
              <div className="relative">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                  className="w-32 h-32 border-4 border-orange-500/10 border-t-orange-500 rounded-full" />
                <motion.div animate={{ rotate: -360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-3 border-2 border-rose-500/20 border-b-rose-500 rounded-full" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                    <Sparkles size={30} className="text-orange-500" />
                  </motion.div>
                </div>
              </div>
              <div className="text-center max-w-xs">
                <h3 className="text-gray-900 dark:text-white text-2xl font-extrabold mb-3">Compiling Scorecard</h3>
                <motion.p key={loadingStepText} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                  className="text-gray-500 dark:text-gray-400 text-sm font-semibold leading-relaxed">
                  {loadingStepText}
                </motion.p>
              </div>
              {/* Animated dots */}
              <div className="flex gap-2">
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                    className="w-2 h-2 bg-orange-500 rounded-full" />
                ))}
              </div>
            </motion.div>
          )}

          {/* ─── 4. FEEDBACK / SCORECARD ─── */}
          {appState === "feedback" && scorecard && (
            <motion.div key="feedback"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="space-y-7">

              {/* Top Row: Score + Radar + Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                {/* Overall Score */}
                <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-gray-200/60 dark:border-gray-800/60 rounded-3xl p-6 shadow-xl flex flex-col items-center justify-center text-center overflow-hidden relative">
                  <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-orange-500 to-rose-500" />
                  <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-5">Overall Score</span>
                  <div className="relative w-44 h-44 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90 absolute inset-0">
                      <circle cx="88" cy="88" r="72" stroke="rgba(249,115,22,0.08)" strokeWidth="10" fill="none" />
                      <motion.circle cx="88" cy="88" r="72" stroke="url(#grad1)" strokeWidth="10" fill="none"
                        strokeLinecap="round"
                        strokeDasharray={452.4}
                        initial={{ strokeDashoffset: 452.4 }}
                        animate={{ strokeDashoffset: 452.4 - (452.4 * scorecard.overallScore) / 100 }}
                        transition={{ duration: 2, ease: "easeOut", delay: 0.3 }} />
                      <defs>
                        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#f97316" />
                          <stop offset="100%" stopColor="#f43f5e" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="flex flex-col items-center z-10">
                      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6, type: "spring" }}
                        className="text-5xl font-black text-gray-900 dark:text-white leading-none">
                        {scorecard.overallScore}
                      </motion.span>
                      <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mt-1">/ 100</span>
                    </div>
                  </div>
                  <div className={`mt-4 px-4 py-1.5 rounded-full text-xs font-extrabold border flex items-center gap-1.5 uppercase tracking-wider ${getScoreMeta(scorecard.overallScore).bg} ${getScoreMeta(scorecard.overallScore).border} ${getScoreMeta(scorecard.overallScore).color}`}>
                    <Trophy size={13} />
                    {scorecard.overallScore >= 75 ? "Excellent" : scorecard.overallScore >= 50 ? "Solid Performance" : "Needs Improvement"}
                  </div>
                </div>

                {/* Radar */}
                <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-gray-200/60 dark:border-gray-800/60 rounded-3xl p-5 shadow-xl flex flex-col">
                  <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">Sub-score Breakdown</h4>
                  <div className="flex-1 min-h-[180px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="70%"
                        data={[
                          { subject: "Technical", value: scorecard.feedback.ratingBreakdown.technicalKnowledge },
                          { subject: "Comms", value: scorecard.feedback.ratingBreakdown.communication },
                          { subject: "Problem Solving", value: scorecard.feedback.ratingBreakdown.problemSolving },
                        ]}>
                        <PolarGrid stroke="rgba(156,163,175,0.12)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: "#9ca3af", fontSize: 10, fontWeight: "bold" }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar name="Score" dataKey="value" stroke="#f97316" fill="#f97316" fillOpacity={0.18} strokeWidth={2} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Sub scores */}
                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800/50">
                    {[
                      { label: "Technical", val: scorecard.feedback.ratingBreakdown.technicalKnowledge, color: "text-blue-500" },
                      { label: "Comms", val: scorecard.feedback.ratingBreakdown.communication, color: "text-emerald-500" },
                      { label: "Problem", val: scorecard.feedback.ratingBreakdown.problemSolving, color: "text-violet-500" },
                    ].map(({ label, val, color }) => (
                      <div key={label} className="text-center">
                        <p className={`text-lg font-extrabold ${color}`}>{val}</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wide">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Assessment */}
                <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-gray-200/60 dark:border-gray-800/60 rounded-3xl p-6 shadow-xl flex flex-col">
                  <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <Sparkles size={12} className="text-orange-500" /> AI Assessment
                  </h4>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 leading-relaxed flex-1">
                    {scorecard.feedback.overall}
                  </p>
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800/50">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Session Profile</p>
                    <p className="text-sm font-extrabold text-gray-800 dark:text-gray-200 mt-1">
                      {scorecard.role} · {scorecard.type}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{scorecard.company} · {scorecard.difficulty}</p>
                  </div>
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-emerald-500/[0.03] dark:bg-emerald-500/[0.04] border border-emerald-500/15 rounded-3xl p-6 space-y-4">
                  <h4 className="text-emerald-500 font-extrabold uppercase tracking-widest text-xs flex items-center gap-2">
                    <CheckCircle size={16} /> Top Strengths
                  </h4>
                  <ul className="space-y-2.5">
                    {scorecard.feedback.strengths.map((str, i) => (
                      <motion.li key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                        className="flex gap-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" /> {str}
                      </motion.li>
                    ))}
                  </ul>
                </div>
                <div className="bg-rose-500/[0.03] dark:bg-rose-500/[0.04] border border-rose-500/15 rounded-3xl p-6 space-y-4">
                  <h4 className="text-rose-500 font-extrabold uppercase tracking-widest text-xs flex items-center gap-2">
                    <AlertTriangle size={16} /> Development Areas
                  </h4>
                  <ul className="space-y-2.5">
                    {scorecard.feedback.weaknesses.map((weak, i) => (
                      <motion.li key={i} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                        className="flex gap-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 flex-shrink-0" /> {weak}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-gradient-to-br from-orange-500/5 via-transparent to-rose-500/5 border border-orange-500/15 rounded-3xl p-6 space-y-4">
                <h4 className="text-orange-500 font-extrabold uppercase tracking-widest text-xs flex items-center gap-2">
                  <Zap size={14} /> Actionable Advice
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {scorecard.feedback.tips.map((tip, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                      className="bg-white/60 dark:bg-gray-900/40 backdrop-blur-md border border-orange-500/10 rounded-2xl p-4 space-y-2">
                      <div className="w-6 h-6 bg-orange-500/10 rounded-lg flex items-center justify-center">
                        <span className="text-[10px] font-extrabold text-orange-500">{i + 1}</span>
                      </div>
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 leading-relaxed">{tip}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Transcript */}
              <div className="space-y-4">
                <h3 className="text-base font-extrabold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <BookOpen size={16} className="text-orange-500" /> Full Transcript & Ideal Answers
                </h3>
                <div className="space-y-3">
                  {scorecard.questions.map((q, idx) => {
                    const isOpen = expandedTranscript[idx];
                    const meta = getScoreMeta(q.score);
                    return (
                      <motion.div key={idx} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                        className="bg-white/70 dark:bg-gray-900/60 backdrop-blur-md border border-gray-200/60 dark:border-gray-800/60 rounded-2xl overflow-hidden hover:border-orange-500/30 transition-all">
                        <button onClick={() => toggleAccordion(idx)}
                          className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left bg-gray-50/60 dark:bg-gray-900/40 cursor-pointer">
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500/15 to-rose-500/10 text-orange-500 font-extrabold text-xs flex items-center justify-center flex-shrink-0 border border-orange-500/20">
                              Q{idx + 1}
                            </span>
                            <span className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate max-w-[220px] md:max-w-[500px]">{q.question}</span>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <span className={`px-2.5 py-0.5 rounded-lg text-xs font-extrabold border ${meta.bg} ${meta.border} ${meta.color}`}>
                              {q.score}/100
                            </span>
                            <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                              <ChevronDown size={16} className="text-gray-400" />
                            </motion.div>
                          </div>
                        </button>

                        <AnimatePresence>
                          {isOpen && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="overflow-hidden border-t border-gray-100 dark:border-gray-800">
                              <div className="p-5 space-y-4 text-sm leading-relaxed">
                                <div className="space-y-1.5">
                                  <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-widest">Your Response</span>
                                  <p className="font-semibold text-gray-700 dark:text-gray-300 italic bg-gray-50 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                                    "{q.answer}"
                                  </p>
                                </div>
                                <div className="space-y-1.5">
                                  <span className="text-[9px] font-extrabold text-orange-500/80 uppercase tracking-widest">AI Critique</span>
                                  <p className="font-semibold text-gray-600 dark:text-gray-400">{q.evaluation}</p>
                                </div>
                                {scorecard.feedback.idealAnswers?.[idx] && (
                                  <div className="space-y-1.5 border-t border-dashed border-gray-100 dark:border-gray-800 pt-3">
                                    <span className="text-[9px] font-extrabold text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                                      <Sparkles size={10} /> Ideal Answer Guide
                                    </span>
                                    <p className="font-semibold text-gray-700 dark:text-gray-300 bg-emerald-500/[0.03] border border-emerald-500/15 p-4 rounded-xl">
                                      {scorecard.feedback.idealAnswers[idx]}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* New Session CTA */}
              <div className="flex justify-center pt-2">
                <motion.button onClick={() => setAppState("setup")}
                  whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
                  className="px-8 py-4 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-extrabold rounded-2xl shadow-xl shadow-orange-500/25 flex items-center gap-2.5">
                  <Play size={17} fill="white" /> Start New Interview Session
                </motion.button>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default MockInterview;
