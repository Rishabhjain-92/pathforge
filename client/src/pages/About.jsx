import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Target, Zap, Heart, Code, Users, Star, TrendingUp } from "lucide-react";
import Navbar from "../components/Navbar";
import logo from "../assets/logo.svg";
const About = () => {
  const values = [
    {
      icon: Zap,
      title: "AI-First",
      desc: "Every feature is powered by intelligent algorithms that personalize your experience.",
      color: "text-orange-400",
      bg: "from-orange-500/20 to-amber-500/10",
      border: "border-orange-500/25",
      iconBg: "from-orange-500 to-amber-400",
    },
    {
      icon: Target,
      title: "Goal-Oriented",
      desc: "Everything on PathForge is designed to move you closer to your dream role.",
      color: "text-blue-400",
      bg: "from-blue-500/20 to-cyan-500/10",
      border: "border-blue-500/25",
      iconBg: "from-blue-500 to-cyan-400",
    },
    {
      icon: Heart,
      title: "Student-Focused",
      desc: "Built specifically for Indian college students and freshers entering the job market.",
      color: "text-pink-400",
      bg: "from-pink-500/20 to-rose-500/10",
      border: "border-pink-500/25",
      iconBg: "from-pink-500 to-rose-400",
    },
  ];

  const stats = [
    { icon: Users, value: "500+", label: "Students", color: "text-orange-400" },
    { icon: Star, value: "4.9★", label: "Rating", color: "text-yellow-400" },
    { icon: TrendingUp, value: "92%", label: "Placed", color: "text-green-400" },
    { icon: Target, value: "50+", label: "Companies", color: "text-blue-400" },
  ];

  const techStack = [
    { name: "React.js", color: "from-blue-500/20 to-cyan-500/10", border: "border-blue-500/30", text: "text-blue-400" },
    { name: "Node.js", color: "from-green-500/20 to-emerald-500/10", border: "border-green-500/30", text: "text-green-400" },
    { name: "Express.js", color: "from-gray-500/20 to-gray-600/10", border: "border-gray-500/30", text: "text-gray-300" },
    { name: "MongoDB", color: "from-green-500/20 to-teal-500/10", border: "border-green-500/30", text: "text-green-400" },
    { name: "Gemini AI", color: "from-orange-500/20 to-amber-500/10", border: "border-orange-500/30", text: "text-orange-400" },
    { name: "Python", color: "from-yellow-500/20 to-amber-500/10", border: "border-yellow-500/30", text: "text-yellow-400" },
    { name: "FastAPI", color: "from-teal-500/20 to-cyan-500/10", border: "border-teal-500/30", text: "text-teal-400" },
    { name: "scikit-learn", color: "from-orange-500/20 to-red-500/10", border: "border-orange-500/30", text: "text-orange-400" },
    { name: "Tailwind CSS", color: "from-cyan-500/20 to-blue-500/10", border: "border-cyan-500/30", text: "text-cyan-400" },
    { name: "Framer Motion", color: "from-purple-500/20 to-violet-500/10", border: "border-purple-500/30", text: "text-purple-400" },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden">

      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div
          animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [20, -20, 20], x: [10, -10, 10] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl"
        />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Navbar */}
      <Navbar />

      <div className="pt-28 pb-20 px-6 max-w-5xl mx-auto relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, type: "spring" }}
            className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 text-orange-400 px-4 py-1.5 rounded-full text-sm mb-6"
          >
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Heart size={14} />
            </motion.div>
            Built with passion for students
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight">
            About{" "}
            <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">
              PathForge
            </span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            PathForge was built to solve a problem every engineering student faces —
            knowing WHAT to learn but never knowing HOW to get there.
          </p>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.1, type: "spring" }}
              whileHover={{ scale: 1.05, y: -4 }}
              className="bg-gray-900/80 border border-gray-800/70 rounded-2xl p-5 text-center backdrop-blur-sm"
            >
              <div className="flex justify-center mb-2">
                <stat.icon size={20} className={stat.color} />
              </div>
              <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
              <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Problem Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mb-10"
        >
          <div className="absolute -inset-px rounded-3xl bg-gradient-to-r from-orange-500/20 via-amber-400/10 to-orange-500/20 blur-sm" />
          <div className="relative bg-gray-900/90 border border-orange-500/20 rounded-3xl p-8 md:p-10 backdrop-blur-xl overflow-hidden">
            {/* Inner decorations */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.03, 0.06, 0.03] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-20 -right-20 w-64 h-64 bg-orange-500 rounded-full blur-3xl pointer-events-none"
            />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-400 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                  <Target size={20} className="text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white">The Problem We Solve</h2>
              </div>

              <p className="text-gray-400 leading-relaxed mb-6 text-lg">
                Platforms like LinkedIn tell you what skills you need. Internshala shows you
                internships. Coursera shows you courses. But nobody tells you:
              </p>

              <motion.div
                whileHover={{ scale: 1.01 }}
                className="bg-gradient-to-br from-orange-500/10 to-amber-500/5 border border-orange-500/20 rounded-2xl p-6 mb-6"
              >
                <p className="text-orange-300 italic text-lg md:text-xl text-center font-semibold leading-relaxed">
                  "Given where I am RIGHT NOW, what exactly should I do TODAY,
                  THIS WEEK, and THIS MONTH to get to Google?"
                </p>
              </motion.div>

              <p className="text-gray-400 leading-relaxed text-lg">
                PathForge answers that question with AI-powered personalized roadmaps,
                skill gap analysis, and weekly recalibration — so you always know
                exactly what to do next.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h2 className="text-3xl font-black text-white text-center mb-8">
            Our{" "}
            <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
              Values
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className={`group relative bg-gradient-to-br ${value.bg} bg-gray-900 border ${value.border} rounded-2xl p-6 text-center overflow-hidden cursor-default`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${value.iconBg} flex items-center justify-center mx-auto mb-4 shadow-lg`}
                >
                  <value.icon size={24} className="text-white" />
                </motion.div>
                <h3 className="text-white font-bold text-lg mb-2">{value.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gray-900/80 border border-gray-800/70 rounded-3xl p-8 mb-10 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl flex items-center justify-center shadow-lg">
              <Code size={20} className="text-white" />
            </div>
            <h2 className="text-2xl font-black text-white">Built With</h2>
          </div>

          <div className="flex flex-wrap gap-3">
            {techStack.map((tech, i) => (
              <motion.span
                key={tech.name}
                initial={{ opacity: 0, scale: 0.7 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, type: "spring" }}
                whileHover={{ scale: 1.08, y: -2 }}
                className={`bg-gradient-to-br ${tech.color} border ${tech.border} ${tech.text} px-4 py-2 rounded-xl text-sm font-medium cursor-default`}
              >
                {tech.name}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <h2 className="text-3xl font-black text-white text-center mb-10">
            The{" "}
            <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
              Journey
            </span>
          </h2>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-orange-500/50 via-orange-500/20 to-transparent" />

            {[
              { date: "May 2026", title: "PathForge Born", desc: "Started as a final year project to solve placement preparation challenges.", color: "bg-orange-500" },
              { date: "May 2026", title: "Core Features Built", desc: "Auth, Profile, Resume Upload, AI Analysis — all working in under a week.", color: "bg-blue-500" },
              { date: "Coming Soon", title: "ML Integration", desc: "Adding placement readiness prediction and smart recommendations.", color: "bg-green-500" },
              { date: "Future", title: "Full Launch", desc: "Open to all Indian engineering students — completely free.", color: "bg-purple-500" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative pl-16 pb-8 last:pb-0"
              >
                <div className={`absolute left-4 top-1 w-4 h-4 ${item.color} rounded-full border-2 border-gray-950 shadow-lg -translate-x-1/2`} />
                <div className="bg-gray-900/60 border border-gray-800/60 rounded-2xl p-5 hover:border-gray-700 transition-all duration-300">
                  <span className="text-orange-400 text-xs font-semibold uppercase tracking-wider">{item.date}</span>
                  <h3 className="text-white font-bold text-lg mt-1 mb-1">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="relative inline-block group">
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-orange-500/40 to-amber-500/40 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.06, boxShadow: "0 20px 60px rgba(249,115,22,0.4)" }}
                whileTap={{ scale: 0.96 }}
                className="relative bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold px-10 py-4 rounded-xl text-lg flex items-center gap-2 mx-auto overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start Your Journey
                  <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    <ArrowRight size={20} />
                  </motion.span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              </motion.button>
            </Link>
          </div>
        </motion.div>

      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800/60 py-10 px-6 relative z-10 mt-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
           {/* Logo */}
                         <Link to="/" className="flex items-center gap-2.5">
                           <img src={logo} alt="PathForge" className="w-8 h-8" />
                           <span className="text-white font-bold text-lg">PathForge</span>
                         </Link>
          
          <div className="flex items-center gap-6 text-sm text-gray-400">
            {["Home", "About", "Contact", "Login"].map((item) => (
              <Link key={item} to={item === "Home" ? "/" : `/${item.toLowerCase()}`} className="hover:text-white transition-colors duration-200">
                {item}
              </Link>
            ))}
          </div>
          <p className="text-gray-500 text-sm">© 2026 PathForge. Built for dreamers.</p>
        </div>
      </footer>

    </div>
  );
};

export default About;