import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Target, Zap, Heart, Code } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Background */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-white">P</div>
            <span className="text-white font-bold text-lg">PathForge</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-400 hover:text-white text-sm transition">Home</Link>
            <Link to="/about" className="text-white text-sm font-medium">About</Link>
            <Link to="/contact" className="text-gray-400 hover:text-white text-sm transition">Contact</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-gray-400 hover:text-white text-sm transition px-4 py-2 rounded-lg hover:bg-gray-800">Login</Link>
            <Link to="/register" className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition">Get Started</Link>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 text-orange-400 px-4 py-1.5 rounded-full text-sm mb-6">
            <Heart size={14} />
            Built with passion for students
          </div>
          <h1 className="text-5xl font-bold mb-4">
            About <span className="text-orange-500">PathForge</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">
            PathForge was built to solve a problem every engineering student faces —
            knowing WHAT to learn but never knowing HOW to get there from where they are.
          </p>
        </motion.div>

        {/* Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Target size={22} className="text-orange-500" />
            The Problem We Solve
          </h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Platforms like LinkedIn tell you what skills you need. Internshala shows you
            internships. Coursera shows you courses. But nobody tells you:
          </p>
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 mb-4">
            <p className="text-orange-300 italic text-lg text-center font-medium">
              "Given where I am RIGHT NOW, what exactly should I do TODAY,
              THIS WEEK, and THIS MONTH to get to Google?"
            </p>
          </div>
          <p className="text-gray-400 leading-relaxed">
            PathForge answers that question with AI-powered personalized roadmaps,
            skill gap analysis, and weekly recalibration — so you always know
            exactly what to do next.
          </p>
        </motion.div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {[
            { icon: Zap, title: "AI-First", desc: "Every feature is powered by intelligent algorithms that personalize your experience.", color: "text-orange-500", bg: "bg-orange-500/10" },
            { icon: Target, title: "Goal-Oriented", desc: "Everything on PathForge is designed to move you closer to your dream role.", color: "text-blue-400", bg: "bg-blue-500/10" },
            { icon: Heart, title: "Student-Focused", desc: "Built specifically for Indian college students and freshers entering the job market.", color: "text-pink-400", bg: "bg-pink-500/10" },
          ].map((value, i) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center"
            >
              <div className={`${value.bg} w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                <value.icon size={22} className={value.color} />
              </div>
              <h3 className="text-white font-semibold mb-2">{value.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{value.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Code size={22} className="text-orange-500" />
            Built With
          </h2>
          <div className="flex flex-wrap gap-2">
            {["React.js", "Node.js", "Express.js", "MongoDB", "Gemini AI", "Python", "FastAPI", "scikit-learn", "Tailwind CSS", "Framer Motion"].map((tech) => (
              <span key={tech} className="bg-gray-800 border border-gray-700 text-gray-300 px-3 py-1.5 rounded-lg text-sm">
                {tech}
              </span>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <Link to="/register">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-xl transition flex items-center gap-2 mx-auto shadow-xl shadow-orange-500/20"
            >
              Start Your Journey
              <ArrowRight size={18} />
            </motion.button>
          </Link>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-white text-xs">P</div>
            <span className="text-white font-bold">PathForge</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-400">
            <Link to="/" className="hover:text-white transition">Home</Link>
            <Link to="/about" className="hover:text-white transition">About</Link>
            <Link to="/contact" className="hover:text-white transition">Contact</Link>
          </div>
          <p className="text-gray-500 text-sm">© 2026 PathForge</p>
        </div>
      </footer>
    </div>
  );
};

export default About;