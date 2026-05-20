import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight, Zap, Target, TrendingUp,
  Map, BookOpen
} from "lucide-react";

const Landing = () => {
  const features = [
    {
      icon: Target,
      title: "Skill Gap Analysis",
      desc: "Compare your current skills with what top companies actually require for your dream role.",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20"
    },
    {
      icon: Map,
      title: "Dream Role Reverse Planner",
      desc: "Enter your dream company and role. Get a personalized month-by-month roadmap to get there.",
      color: "text-orange-400",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20"
    },
    {
      icon: Zap,
      title: "AI Resume Analyzer",
      desc: "Upload your resume and get instant ATS score, missing skills, and improvement suggestions.",
      color: "text-green-400",
      bg: "bg-green-500/10",
      border: "border-green-500/20"
    },
    {
      icon: TrendingUp,
      title: "ML Readiness Score",
      desc: "Our machine learning model predicts your placement readiness based on your profile.",
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20"
    },
    {
      icon: BookOpen,
      title: "Smart Recommendations",
      desc: "Get personalized course and internship recommendations matched to your skill gaps.",
      color: "text-pink-400",
      bg: "bg-pink-500/10",
      border: "border-pink-500/20"
    },
    {
      icon: TrendingUp,
      title: "Weekly Recalibration",
      desc: "Your roadmap adapts every week based on your actual progress and completed tasks.",
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20"
    },
  ];

  const stats = [
    { value: "500+", label: "Students Using PathForge" },
    { value: "92%", label: "Placement Success Rate" },
    { value: "50+", label: "Companies Targeted" },
    { value: "4.9★", label: "Average Rating" },
  ];

  const steps = [
    { step: "01", title: "Create Your Profile", desc: "Add your skills, target role, and dream company." },
    { step: "02", title: "Upload Your Resume", desc: "Get AI-powered analysis and ATS score instantly." },
    { step: "03", title: "Generate Your Roadmap", desc: "Get a personalized month-wise plan to your goal." },
    { step: "04", title: "Track & Improve", desc: "Weekly check-ins keep your roadmap on track." },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Fixed background orbs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-50 -right-50 w-150 h-150 bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-50 -left-50 w-125 h-125 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800"
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-orange-500/30">
              P
            </div>
            <span className="text-white font-bold text-lg">PathForge</span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-400 hover:text-white text-sm transition">
              Home
            </Link>
            <Link to="/about" className="text-gray-400 hover:text-white text-sm transition">
              About
            </Link>
            <Link to="/contact" className="text-gray-400 hover:text-white text-sm transition">
              Contact
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-gray-400 hover:text-white text-sm transition px-4 py-2 rounded-lg hover:bg-gray-800"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition shadow-lg shadow-orange-500/20"
            >
              Get Started
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 text-orange-400 px-4 py-1.5 rounded-full text-sm mb-8"
          >
            <Zap size={14} />
            AI-Powered Career Navigation Platform
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold leading-tight mb-6"
          >
            Forge Your Path to
            <span className="text-orange-500 block">Your Dream Role</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            PathForge reverse-engineers your journey to your dream company.
            Get a personalized roadmap, AI resume analysis, skill gap insights,
            and weekly recalibration — all in one place.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-4 flex-wrap"
          >
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-xl transition flex items-center gap-2 shadow-xl shadow-orange-500/30 text-lg"
              >
                Start For Free
                <ArrowRight size={20} />
              </motion.button>
            </Link>
            <Link to="/about">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gray-800 hover:bg-gray-700 text-white font-semibold px-8 py-4 rounded-xl transition border border-gray-700 text-lg"
              >
                Learn More
              </motion.button>
            </Link>
          </motion.div>

          {/* Social Proof */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-gray-500 text-sm mt-6"
          >
            ✨ Free to use • No credit card required • Built for Indian students
          </motion.p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-6 border-y border-gray-800 relative z-10">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <p className="text-3xl font-bold text-orange-500">{stat.value}</p>
              <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything You Need to
              <span className="text-orange-500"> Get Placed</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              PathForge combines AI, ML, and smart planning to give you
              an unfair advantage in your placement journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className={`bg-gray-900 border ${feature.border} rounded-2xl p-6 cursor-default`}
              >
                <div className={`${feature.bg} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                  <feature.icon size={22} className={feature.color} />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-gray-900/50 relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              How PathForge
              <span className="text-orange-500"> Works</span>
            </h2>
            <p className="text-gray-400 text-lg">
              Four simple steps to your dream placement
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative"
              >
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-linear-to-r from-orange-500/50 to-transparent z-0" />
                )}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 relative z-10">
                  <div className="text-4xl font-black text-orange-500/20 mb-3">
                    {step.step}
                  </div>
                  <h3 className="text-white font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-linear-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-3xl p-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Forge Your Path?
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Join hundreds of students who are already using PathForge
              to land their dream internships and jobs.
            </p>
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-10 py-4 rounded-xl transition shadow-xl shadow-orange-500/30 text-lg flex items-center gap-2 mx-auto"
              >
                Get Started Free
                <ArrowRight size={20} />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-10 px-6 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-white text-xs">
              P
            </div>
            <span className="text-white font-bold">PathForge</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <Link to="/" className="hover:text-white transition">Home</Link>
            <Link to="/about" className="hover:text-white transition">About</Link>
            <Link to="/contact" className="hover:text-white transition">Contact</Link>
            <Link to="/login" className="hover:text-white transition">Login</Link>
          </div>
          <p className="text-gray-500 text-sm">
            © 2026 PathForge. Built for dreamers.
          </p>
        </div>
      </footer>

    </div>
  );
};

export default Landing;