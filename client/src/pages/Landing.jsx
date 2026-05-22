import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import { ArrowRight, Zap, Target, TrendingUp, Map, BookOpen } from "lucide-react";
import Navbar from "../components/Navbar";
import logo from "../assets/logo.svg";

const FloatingOrb = ({ className, delay = 0, duration = 6 }) => (
  <motion.div
    className={className}
    animate={{ y: [-20, 20, -20], x: [-10, 10, -10], scale: [1, 1.05, 1] }}
    transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
  />
);

const Particle = ({ style }) => (
  <motion.div
    className="absolute w-1 h-1 rounded-full bg-orange-400/40"
    style={style}
    animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.8, 1.2, 0.8] }}
    transition={{
      duration: 2 + Math.random() * 3,
      delay: Math.random() * 4,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

const Landing = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const y = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const [particles] = useState(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      style: {
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      },
    }))
  );

  const features = [
    { icon: Target, title: "Skill Gap Analysis", desc: "Compare your current skills with what top companies actually require for your dream role.", color: "text-blue-400", bg: "from-blue-500/20 to-cyan-500/10", border: "border-blue-500/25", glow: "group-hover:shadow-blue-500/20", iconBg: "from-blue-500 to-cyan-500" },
    { icon: Map, title: "Dream Role Reverse Planner", desc: "Enter your dream company and role. Get a personalized month-by-month roadmap to get there.", color: "text-orange-400", bg: "from-orange-500/20 to-amber-500/10", border: "border-orange-500/25", glow: "group-hover:shadow-orange-500/20", iconBg: "from-orange-500 to-amber-400" },
    { icon: Zap, title: "AI Resume Analyzer", desc: "Upload your resume and get instant ATS score, missing skills, and improvement suggestions.", color: "text-green-400", bg: "from-green-500/20 to-emerald-500/10", border: "border-green-500/25", glow: "group-hover:shadow-green-500/20", iconBg: "from-green-500 to-emerald-400" },
    { icon: TrendingUp, title: "ML Readiness Score", desc: "Our machine learning model predicts your placement readiness based on your profile.", color: "text-purple-400", bg: "from-purple-500/20 to-violet-500/10", border: "border-purple-500/25", glow: "group-hover:shadow-purple-500/20", iconBg: "from-purple-500 to-violet-500" },
    { icon: BookOpen, title: "Smart Recommendations", desc: "Get personalized course and internship recommendations matched to your skill gaps.", color: "text-pink-400", bg: "from-pink-500/20 to-rose-500/10", border: "border-pink-500/25", glow: "group-hover:shadow-pink-500/20", iconBg: "from-pink-500 to-rose-400" },
    { icon: TrendingUp, title: "Weekly Recalibration", desc: "Your roadmap adapts every week based on your actual progress and completed tasks.", color: "text-yellow-400", bg: "from-yellow-500/20 to-orange-500/10", border: "border-yellow-500/25", glow: "group-hover:shadow-yellow-500/20", iconBg: "from-yellow-400 to-orange-500" },
  ];

  const stats = [
    { value: "500+", label: "Students Using PathForge" },
    { value: "92%", label: "Placement Success Rate" },
    { value: "50+", label: "Companies Targeted" },
    { value: "4.9★", label: "Average Rating" },
  ];

  const steps = [
    { step: "01", title: "Create Your Profile", desc: "Add your skills, target role, and dream company.", color: "from-orange-500 to-amber-400" },
    { step: "02", title: "Upload Your Resume", desc: "Get AI-powered analysis and ATS score instantly.", color: "from-blue-500 to-cyan-400" },
    { step: "03", title: "Generate Your Roadmap", desc: "Get a personalized month-wise plan to your goal.", color: "from-green-500 to-emerald-400" },
    { step: "04", title: "Track & Improve", desc: "Weekly check-ins keep your roadmap on track.", color: "from-purple-500 to-violet-400" },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden">

      {/* Particle field */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {particles.map((p) => <Particle key={p.id} style={p.style} />)}
      </div>

      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <FloatingOrb className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-orange-500/6 rounded-full blur-3xl" delay={0} duration={8} />
        <FloatingOrb className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-blue-500/6 rounded-full blur-3xl" delay={2} duration={10} />
        <FloatingOrb className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-500/4 rounded-full blur-3xl" delay={4} duration={12} />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-24 px-6 z-10">
        <motion.div style={{ y, opacity }} className="max-w-4xl mx-auto text-center">

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 text-orange-400 px-4 py-1.5 rounded-full text-sm mb-8"
          >
            <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }}>
              <Zap size={14} />
            </motion.div>
            AI-Powered Career Navigation Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-5xl md:text-7xl font-black leading-[1.05] mb-6 tracking-tight"
          >
            Forge Your Path to
            <span className="block bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent mt-1">
              Your Dream Role
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            PathForge reverse-engineers your journey to your dream company.
            Get a personalized roadmap, AI resume analysis, skill gap insights,
            and weekly recalibration — all in one place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="flex items-center justify-center gap-4 flex-wrap"
          >
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.06, boxShadow: "0 20px 60px rgba(249,115,22,0.4)" }}
                whileTap={{ scale: 0.96 }}
                className="relative group bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold px-8 py-4 rounded-xl flex items-center gap-2 text-lg overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start For Free
                  <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    <ArrowRight size={20} />
                  </motion.span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              </motion.button>
            </Link>
            <Link to="/about">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="bg-gray-800/80 hover:bg-gray-700/80 text-white font-semibold px-8 py-4 rounded-xl border border-gray-700/60 hover:border-gray-600 text-lg backdrop-blur-sm transition-all duration-200"
              >
                Learn More
              </motion.button>
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="text-gray-500 text-sm mt-6"
          >
            ✨ Free to use • No credit card required • Built for Indian students
          </motion.p>

          {/* Rotating rings */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-orange-500/5 pointer-events-none"
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-dashed border-orange-500/8 pointer-events-none"
          />
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-14 px-6 border-y border-gray-800/60 relative z-10">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="text-center group"
            >
              <p className="text-3xl font-black bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                {stat.value}
              </p>
              <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Everything You Need to
              <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent"> Get Placed</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              PathForge combines AI, ML, and smart planning to give you an unfair advantage.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className={`group relative bg-gradient-to-br ${feature.bg} bg-gray-900 border ${feature.border} rounded-2xl p-6 cursor-default overflow-hidden transition-all duration-300 hover:shadow-2xl ${feature.glow}`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.iconBg} flex items-center justify-center mb-4 shadow-lg`}
                >
                  <feature.icon size={22} className="text-white" />
                </motion.div>

                <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              How PathForge
              <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent"> Works</span>
            </h2>
            <p className="text-gray-400 text-lg">Four simple steps to your dream placement</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative group"
              >
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-px z-0 overflow-hidden">
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.15 + 0.4 }}
                      className="w-full h-full bg-gradient-to-r from-orange-500/50 to-transparent origin-left"
                    />
                  </div>
                )}
                <motion.div
                  whileHover={{ y: -6 }}
                  className="bg-gray-900/80 border border-gray-800/70 rounded-2xl p-6 relative z-10 group-hover:border-gray-700 transition-all duration-300 backdrop-blur-sm"
                >
                  <div className={`text-5xl font-black bg-gradient-to-br ${step.color} bg-clip-text text-transparent mb-3 opacity-60 group-hover:opacity-100 transition-opacity`}>
                    {step.step}
                  </div>
                  <h3 className="text-white font-bold mb-2">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative group"
          >
            <div className="absolute -inset-px rounded-3xl bg-gradient-to-r from-orange-500/50 via-amber-400/30 to-orange-500/50 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-700" />
            <div className="relative bg-gray-900/90 border border-orange-500/20 group-hover:border-orange-500/40 rounded-3xl p-12 backdrop-blur-xl overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-orange-500/60 to-transparent" />
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.03, 0.07, 0.03] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-orange-500 rounded-full blur-3xl pointer-events-none"
              />
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                  Ready to Forge Your Path?
                </h2>
                <p className="text-gray-400 text-lg mb-10">
                  Join hundreds of students already using PathForge to land their dream jobs.
                </p>
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.07, boxShadow: "0 20px 60px rgba(249,115,22,0.4)" }}
                    whileTap={{ scale: 0.96 }}
                    className="relative group/btn bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold px-10 py-4 rounded-xl text-lg flex items-center gap-2 mx-auto overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Get Started Free
                      <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                        <ArrowRight size={20} />
                      </motion.span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500" />
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800/60 py-10 px-6 relative z-10">
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

export default Landing;