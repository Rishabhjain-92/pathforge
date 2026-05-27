import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  MessageSquare, Sparkles, Play, Award, Brain,
  ChevronRight, Mic, MicOff, RefreshCw, Star,
  AlertTriangle, CheckCircle, Clock, Send, ChevronDown,
  ChevronUp, ArrowLeft, ShieldAlert, BookOpen, Target, Calendar
} from "lucide-react";
import toast from "react-hot-toast";
import {
  Radar, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from "recharts";

// Speech-to-Text browser detection
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const MockInterview = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // App States: 'setup' | 'active' | 'loading_feedback' | 'feedback'
  const [appState, setAppState] = useState("setup");
  
  // Setup fields
  const [role, setRole] = useState(user?.targetRole || "");
  const [company, setCompany] = useState(user?.targetCompany || "");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [interviewType, setInterviewType] = useState("Technical");

  // Interview state
  const [interviewId, setInterviewId] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  
  // Active timing & Speech
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  // Scorecard / Feedback
  const [scorecard, setScorecard] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const [expandedTranscript, setExpandedTranscript] = useState({});

  // Dynamic analysis text
  const [loadingStepText, setLoadingStepText] = useState("AI Interviewer is analyzing...");
  const analysisTexts = [
    "Parsing answers for core technical syntax...",
    "Assessing conceptual depth and problem solving...",
    "Evaluating verbal communication clarity...",
    "Formatting personalized ideal answers...",
    "Calibrating overall performance analytics..."
  ];

  // Sync user profile updates to form on load
  useEffect(() => {
    if (user) {
      if (!role) setRole(user.targetRole || "");
      if (!company) setCompany(user.targetCompany || "");
    }
  }, [user]);

  // Load history
  useEffect(() => {
    fetchHistory();
  }, []);

  // Timer helper
  useEffect(() => {
    if (appState === "active") {
      timerRef.current = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setSecondsElapsed(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [appState]);

  // Speech recognition setup
  useEffect(() => {
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = false;
      rec.lang = "en-US";

      rec.onresult = (event) => {
        const text = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");
        setAnswer((prev) => (prev ? prev + " " + text : text));
      };

      rec.onerror = (e) => {
        console.error("Speech Recognition Error:", e);
        setIsListening(false);
        toast.error("Mic issue. You can continue typing!");
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/interview/history", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(res.data.history);
    } catch (err) {
      console.error("Error fetching history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const startNewInterviewSession = async (e) => {
    e.preventDefault();
    if (!role.trim() || !company.trim()) {
      return toast.error("Please fill in both Role and Company!");
    }

    setLoadingAction(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/interview/start",
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
    } finally {
      setLoadingAction(false);
    }
  };

  const toggleMicListening = () => {
    if (!SpeechRecognition) {
      return toast.error("Speech Recognition is not supported by your browser. Please type!");
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        toast.success("Listening... Speak clearly.");
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleAnswerSubmit = async () => {
    if (!answer.trim()) {
      return toast.error("Please write or speak an answer before submitting.");
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    setLoadingAction(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/interview/submit",
        { interviewId, answer },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Save answer/eval for current index in state
      const updatedQuestions = [...questions];
      updatedQuestions[currentIndex].answer = answer;
      updatedQuestions[currentIndex].score = res.data.score;
      updatedQuestions[currentIndex].evaluation = res.data.evaluation;

      if (res.data.completed) {
        // Prepare dynamic loading messages for final scorecard compiling
        setAppState("loading_feedback");
        let idx = 0;
        const textInterval = setInterval(() => {
          if (idx < analysisTexts.length) {
            setLoadingStepText(analysisTexts[idx]);
            idx++;
          } else {
            clearInterval(textInterval);
          }
        }, 1500);

        // Fetch feedback scorecard
        const feedbackRes = await axios.get(
          `http://localhost:5000/api/interview/feedback/${interviewId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        clearInterval(textInterval);
        setScorecard(feedbackRes.data.interview);
        setAppState("feedback");
        toast.success("AI Scorecard generated successfully! 🏆");
        fetchHistory(); // refresh history
      } else {
        // Move to next question in active list
        updatedQuestions.push({
          question: res.data.nextQuestion,
          answer: "",
          evaluation: "",
          score: 0
        });
        setQuestions(updatedQuestions);
        setCurrentIndex(res.data.currentIndex);
        setAnswer("");
        toast.success("Response submitted. Next question! ➡️");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit answer.");
    } finally {
      setLoadingAction(false);
    }
  };

  const viewPastInterviewDetails = async (id) => {
    setLoadingAction(true);
    setAppState("loading_feedback");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/interview/feedback/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setScorecard(res.data.interview);
      setAppState("feedback");
    } catch (err) {
      toast.error("Failed to load interview report.");
      setAppState("setup");
    } finally {
      setLoadingAction(false);
    }
  };

  const toggleAccordion = (idx) => {
    setExpandedTranscript((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Helper score color
  const getScoreColor = (score) => {
    if (score >= 75) return "text-emerald-500 border-emerald-500/25 bg-emerald-500/5";
    if (score >= 50) return "text-amber-500 border-amber-500/25 bg-amber-500/5";
    return "text-rose-500 border-rose-500/25 bg-rose-500/5";
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200/80 dark:border-gray-800/80 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent flex items-center gap-3">
            <Brain className="text-orange-500" />
            AI Mock Interview Room
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            State-of-the-art corporate style simulated technical and behavioral interviews.
          </p>
        </div>
        {appState === "feedback" && (
          <button
            onClick={() => setAppState("setup")}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800/60 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl font-bold border border-gray-200/80 dark:border-gray-700/60 transition-all text-sm cursor-pointer"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        
        {/* ─── 1. SETUP STATE ─── */}
        {appState === "setup" && (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Setup Form */}
            <div className="lg:col-span-1 bg-white/70 dark:bg-gray-900/60 backdrop-blur-md border border-gray-200/80 dark:border-gray-800/60 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-6 text-orange-500 font-extrabold uppercase text-xs tracking-wider">
                  <span className="p-1.5 bg-orange-500/10 rounded-lg"><Sparkles size={16} /></span>
                  Configure Session
                </div>

                <form onSubmit={startNewInterviewSession} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                      Target Role
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Frontend Developer"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200/80 dark:border-gray-700/60 focus:outline-none focus:border-orange-500 text-sm font-semibold transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                      Target Company
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Google"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200/80 dark:border-gray-700/60 focus:outline-none focus:border-orange-500 text-sm font-semibold transition-all"
                      required
                    />
                  </div>

                  {/* Difficulty Selector */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                      Difficulty Level
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {["Beginner", "Intermediate", "Advanced"].map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setDifficulty(level)}
                          className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            difficulty === level
                              ? "bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-500/20"
                              : "bg-gray-50 dark:bg-gray-800/40 border-gray-200/60 dark:border-gray-700/40 text-gray-500 hover:text-orange-500"
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Interview Type Selector */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                      Round Focus
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {["Technical", "Behavioral"].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setInterviewType(type)}
                          className={`py-2.5 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            interviewType === type
                              ? "bg-rose-500 border-rose-500 text-white shadow-md shadow-rose-500/20"
                              : "bg-gray-50 dark:bg-gray-800/40 border-gray-200/60 dark:border-gray-700/40 text-gray-500 hover:text-rose-500"
                          }`}
                        >
                          <MessageSquare size={14} />
                          {type} Round
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loadingAction}
                    className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-extrabold rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
                  >
                    {loadingAction ? (
                      <RefreshCw size={18} className="animate-spin" />
                    ) : (
                      <>
                        <Play size={18} fill="white" />
                        Initialize AI Interviewer
                      </>
                    )}
                  </button>
                </form>
              </div>

              <div className="mt-8 border-t border-gray-200/50 dark:border-gray-700/30 pt-4 text-center">
                <span className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold flex items-center justify-center gap-1.5 uppercase tracking-wider">
                  <ShieldAlert size={12} />
                  Uses Groq Llama-3.3 70B Engine
                </span>
              </div>
            </div>

            {/* Past Interviews Timeline */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <Clock size={18} className="text-orange-500" />
                Your Past Interviews History
              </h3>

              {loadingHistory ? (
                <div className="bg-white/50 dark:bg-gray-900/40 border border-gray-200/50 dark:border-gray-800/50 rounded-2xl h-80 flex items-center justify-center">
                  <RefreshCw className="animate-spin text-orange-500" size={32} />
                </div>
              ) : history.length === 0 ? (
                <div className="bg-white/50 dark:bg-gray-900/40 border border-gray-200/50 dark:border-gray-800/50 p-12 rounded-2xl text-center space-y-4">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800/60 rounded-full flex items-center justify-center mx-auto text-gray-400">
                    <MessageSquare size={28} />
                  </div>
                  <h4 className="text-gray-700 dark:text-gray-300 font-bold">No sessions found</h4>
                  <p className="text-sm text-gray-400 max-w-sm mx-auto">
                    You haven&apos;t conducted any AI mock interviews yet. Set up parameters on the left to start!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
                  {history.map((session) => (
                    <div
                      key={session._id}
                      className="bg-white dark:bg-gray-900/60 border border-gray-200/60 dark:border-gray-800/60 rounded-2xl p-5 hover:border-orange-500/50 transition-all flex flex-col justify-between group shadow-sm"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase border ${
                            session.type === "Technical"
                              ? "bg-blue-500/10 border-blue-500/20 text-blue-500"
                              : "bg-purple-500/10 border-purple-500/20 text-purple-500"
                          }`}>
                            {session.type}
                          </span>
                          <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold flex items-center gap-1">
                            <Calendar size={12} />
                            {new Date(session.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric", month: "short"
                            })}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-base font-extrabold text-gray-800 dark:text-gray-200 truncate">
                            {session.role}
                          </h4>
                          <p className="text-xs font-bold text-gray-400 dark:text-gray-500">
                            at {session.company} ({session.difficulty})
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 border-t border-gray-100 dark:border-gray-800/60 pt-4 flex items-center justify-between">
                        <div>
                          {session.status === "completed" ? (
                            <div className="flex items-center gap-1.5">
                              <span className="text-2xl font-extrabold text-gray-800 dark:text-white leading-none">
                                {session.overallScore}
                              </span>
                              <div className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">
                                Overall<br/>Score
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs font-extrabold text-amber-500 flex items-center gap-1 animate-pulse">
                              In Progress
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => viewPastInterviewDetails(session._id)}
                          className="px-3 py-1.5 bg-gray-50 hover:bg-orange-500 dark:bg-gray-800/80 dark:hover:bg-orange-500 text-gray-600 hover:text-white dark:text-gray-300 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                        >
                          {session.status === "completed" ? "View Report" : "Resume"}
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ─── 2. ACTIVE INTERVIEW STATE ─── */}
        {appState === "active" && (
          <motion.div
            key="active"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-4xl mx-auto space-y-6"
          >
            {/* Session Info Bar */}
            <div className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-md border border-gray-200/80 dark:border-gray-800/60 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3 shadow-md">
              <div className="flex items-center gap-3">
                <span className="p-2 bg-rose-500/10 text-rose-500 rounded-xl">
                  <Target size={18} />
                </span>
                <div>
                  <h4 className="text-sm font-extrabold text-gray-800 dark:text-white leading-tight">
                    {role} at {company}
                  </h4>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    {difficulty} • {interviewType} Round
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Timer */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-gray-800/60 border border-gray-200/40 dark:border-gray-700/40 rounded-xl font-mono text-xs font-bold text-gray-600 dark:text-gray-300">
                  <Clock size={14} className="text-orange-500" />
                  {formatTimer(secondsElapsed)}
                </div>

                {/* Progress bar */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    Q {currentIndex + 1} / 5
                  </span>
                  <div className="w-24 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-rose-500 transition-all duration-500"
                      style={{ width: `${((currentIndex + 1) / 5) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Main Interactive Screen */}
            <div className="bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-950 border border-gray-200/80 dark:border-gray-800/60 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
              
              {/* Question Box */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-extrabold text-orange-500 uppercase tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
                  Interviewer:
                </div>
                <div className="bg-orange-500/5 border border-orange-500/10 p-5 rounded-2xl">
                  <p className="text-base md:text-lg font-bold text-gray-800 dark:text-gray-100 leading-relaxed">
                    {questions[currentIndex]?.question}
                  </p>
                </div>
              </div>

              {/* Response Box */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
                    Your Response:
                    {isListening && (
                      <span className="text-[10px] font-bold text-rose-500 animate-pulse uppercase tracking-widest bg-rose-500/5 border border-rose-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                        Listening
                      </span>
                    )}
                  </label>
                  <span className="text-xs font-bold text-gray-400 dark:text-gray-500">
                    {answer.split(/\s+/).filter(Boolean).length} Words
                  </span>
                </div>

                <div className="relative">
                  <textarea
                    placeholder="Type your response here or click the microphone to speak your answer aloud..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    rows={6}
                    className="w-full p-5 rounded-2xl bg-gray-50/50 dark:bg-gray-800/25 border border-gray-200/80 dark:border-gray-700/60 focus:outline-none focus:border-orange-500 font-semibold text-sm md:text-base leading-relaxed resize-none shadow-inner"
                  />

                  {/* Speech mic overlay button */}
                  <button
                    onClick={toggleMicListening}
                    type="button"
                    className={`absolute bottom-4 right-4 p-3 rounded-full border transition-all cursor-pointer ${
                      isListening
                        ? "bg-rose-500 border-rose-500 text-white animate-pulse"
                        : "bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-600 shadow-md"
                    }`}
                    title={isListening ? "Stop listening" : "Speak answer"}
                  >
                    {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                  </button>
                </div>
              </div>

              {/* Submit & Navigation Bar */}
              <div className="flex items-center justify-between border-t border-gray-200/50 dark:border-gray-700/30 pt-6">
                <span className="text-xs font-semibold text-gray-400 dark:text-gray-500">
                  Tip: Speak naturally, elaborate on technical points, and explain your thought process!
                </span>
                <button
                  onClick={handleAnswerSubmit}
                  disabled={loadingAction}
                  className="px-6 py-3.5 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-extrabold rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all flex items-center gap-2 cursor-pointer text-sm"
                >
                  {loadingAction ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Submit & Next
                      <Send size={16} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── 3. LOADING SCORING STATE ─── */}
        {appState === "loading_feedback" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-[60vh] gap-6"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-28 h-28 border-4 border-orange-500/15 border-t-orange-500 rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.25, 1], rotate: [0, 180, 360] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Sparkles size={36} className="text-orange-500" />
              </motion.div>
            </div>
            
            <div className="text-center max-w-sm">
              <h3 className="text-gray-900 dark:text-white text-xl font-extrabold mb-2">
                Compiling AI Scorecard
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm animate-pulse leading-relaxed font-semibold">
                {loadingStepText}
              </p>
            </div>
          </motion.div>
        )}

        {/* ─── 4. DETAILED SCORECARD / FEEDBACK STATE ─── */}
        {appState === "feedback" && scorecard && (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            {/* Top Score Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Overall Circular Score Indicator */}
              <div className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-md border border-gray-200/80 dark:border-gray-800/60 p-6 rounded-3xl shadow-lg flex flex-col items-center justify-center text-center">
                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
                  Overall Score
                </span>

                <div className="relative flex items-center justify-center w-40 h-40">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="65"
                      stroke="rgba(249, 115, 22, 0.1)"
                      strokeWidth="10"
                      fill="transparent"
                    />
                    <motion.circle
                      cx="80"
                      cy="80"
                      r="65"
                      stroke="url(#orangeRoseGradient)"
                      strokeWidth="10"
                      fill="transparent"
                      strokeDasharray={408.4}
                      initial={{ strokeDashoffset: 408.4 }}
                      animate={{ strokeDashoffset: 408.4 - (408.4 * scorecard.overallScore) / 100 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                    <defs>
                      <linearGradient id="orangeRoseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#f43f5e" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-gray-850 dark:text-white leading-none">
                      {scorecard.overallScore}
                    </span>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 mt-1">
                      / 100 Score
                    </span>
                  </div>
                </div>

                <div className="mt-4 px-4 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 uppercase tracking-wider bg-orange-500/5 border-orange-500/10 text-orange-500">
                  <Award size={14} />
                  {scorecard.overallScore >= 75 ? "EXCELLENT PERFORMANCE" : scorecard.overallScore >= 50 ? "SOLID STRIDES" : "Needs Review"}
                </div>
              </div>

              {/* Sub-Category Radar Chart */}
              <div className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-md border border-gray-200/80 dark:border-gray-800/60 p-5 rounded-3xl shadow-lg flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
                    Sub-score Breakdown
                  </h4>
                </div>
                <div className="h-44 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart
                      cx="50%"
                      cy="50%"
                      outerRadius="75%"
                      data={[
                        { subject: "Technical", value: scorecard.feedback.ratingBreakdown.technicalKnowledge },
                        { subject: "Communication", value: scorecard.feedback.ratingBreakdown.communication },
                        { subject: "Problem Solving", value: scorecard.feedback.ratingBreakdown.problemSolving }
                      ]}
                    >
                      <PolarGrid stroke="rgba(156, 163, 175, 0.15)" />
                      <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: "#9ca3af", fontSize: 10, fontWeight: "bold" }}
                      />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#9ca3af" }} />
                      <Radar
                        name="Candidate"
                        dataKey="value"
                        stroke="#f97316"
                        fill="#f97316"
                        fillOpacity={0.2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* High-level Summary Card */}
              <div className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-md border border-gray-200/80 dark:border-gray-800/60 p-6 rounded-3xl shadow-lg flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
                    Overall AI Assessment
                  </h4>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 leading-relaxed">
                    {scorecard.feedback.overall}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center gap-3">
                  <div className="text-xs font-bold text-gray-400 dark:text-gray-500">
                    Target Profile:
                    <span className="block text-gray-800 dark:text-gray-200 font-extrabold text-sm truncate">
                      {scorecard.role} ({scorecard.type})
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Key Insights (Strengths / Weaknesses) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Key Strengths */}
              <div className="bg-emerald-500/[0.02] border border-emerald-500/10 p-6 rounded-3xl shadow-sm space-y-4">
                <h4 className="text-emerald-500 font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                  <CheckCircle size={18} />
                  Top Technical Strengths
                </h4>
                <ul className="space-y-3">
                  {scorecard.feedback.strengths.map((str, i) => (
                    <li key={i} className="flex gap-2.5 text-sm font-semibold text-gray-600 dark:text-gray-350">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                      {str}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses / Improvements */}
              <div className="bg-rose-500/[0.02] border border-rose-500/10 p-6 rounded-3xl shadow-sm space-y-4">
                <h4 className="text-rose-500 font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                  <AlertTriangle size={18} />
                  Key Development Areas
                </h4>
                <ul className="space-y-3">
                  {scorecard.feedback.weaknesses.map((weak, i) => (
                    <li key={i} className="flex gap-2.5 text-sm font-semibold text-gray-600 dark:text-gray-350">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 flex-shrink-0" />
                      {weak}
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Actionable Tips */}
            <div className="bg-gradient-to-r from-orange-500/5 to-rose-500/5 border border-orange-500/10 p-6 rounded-3xl shadow-sm space-y-4">
              <h4 className="text-orange-500 font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                <Target size={18} />
                Actionable Advice & Tips
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {scorecard.feedback.tips.map((tip, i) => (
                  <div key={i} className="bg-white/40 dark:bg-gray-800/20 border border-orange-500/10 rounded-2xl p-4 space-y-2">
                    <span className="text-[10px] font-black text-orange-500/60 uppercase tracking-widest">
                      Strategy {i + 1}
                    </span>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 leading-relaxed">
                      {tip}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Full Transcript Accordions */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <BookOpen size={18} className="text-orange-500" />
                Turn-by-Turn Interview Transcript & Ideal Answers
              </h3>

              <div className="space-y-3">
                {scorecard.questions.map((q, idx) => {
                  const isOpen = expandedTranscript[idx];
                  return (
                    <div
                      key={idx}
                      className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800/60 rounded-2xl overflow-hidden shadow-sm hover:border-orange-500/30 transition-all"
                    >
                      {/* Accordion Trigger */}
                      <button
                        onClick={() => toggleAccordion(idx)}
                        className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left font-bold text-gray-800 dark:text-white bg-gray-50/50 dark:bg-gray-900/60 cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-orange-500/10 text-orange-500 font-extrabold text-sm flex items-center justify-center flex-shrink-0">
                            Q{idx + 1}
                          </span>
                          <span className="truncate max-w-[200px] md:max-w-[500px] text-sm md:text-base">
                            {q.question}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className={`px-2.5 py-0.5 rounded-lg text-xs font-extrabold border ${getScoreColor(q.score)}`}>
                            {q.score}/100
                          </span>
                          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>
                      </button>

                      {/* Accordion Content */}
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            className="overflow-hidden border-t border-gray-100 dark:border-gray-800"
                          >
                            <div className="p-5 space-y-4 text-sm leading-relaxed">
                              
                              {/* Answer */}
                              <div className="space-y-1">
                                <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                                  Your Response
                                </span>
                                <p className="font-semibold text-gray-700 dark:text-gray-300 italic bg-gray-50 dark:bg-gray-800/30 p-3 rounded-xl">
                                  &quot;{q.answer}&quot;
                                </p>
                              </div>

                              {/* AI Critique */}
                              <div className="space-y-1">
                                <span className="text-[10px] font-black text-orange-500/80 uppercase tracking-widest">
                                  AI Critique
                                </span>
                                <p className="font-semibold text-gray-600 dark:text-gray-350">
                                  {q.evaluation}
                                </p>
                              </div>

                              {/* Ideal Answer */}
                              {scorecard.feedback.idealAnswers && scorecard.feedback.idealAnswers[idx] && (
                                <div className="space-y-1 border-t border-dashed border-gray-100 dark:border-gray-800 pt-3">
                                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                                    <Sparkles size={12} />
                                    Ideal/Perfect Response Guide
                                  </span>
                                  <p className="font-semibold text-gray-700 dark:text-gray-300 bg-emerald-500/[0.02] border border-emerald-500/10 p-4 rounded-xl">
                                    {scorecard.feedback.idealAnswers[idx]}
                                  </p>
                                </div>
                              )}

                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default MockInterview;
