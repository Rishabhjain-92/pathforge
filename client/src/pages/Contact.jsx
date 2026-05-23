import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Mail, MessageSquare, User, Send, Code2, ExternalLink } from "lucide-react";
import Navbar from "../components/Navbar";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-300">

      <div className="fixed bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Navbar */}
      <Navbar />

      <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <h1 className="text-5xl font-bold mb-4">
            Get In <span className="text-orange-500">Touch</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-xl mx-auto">
            Have a question, suggestion, or want to collaborate?
            We'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-5"
          >
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm dark:shadow-none">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Contact Information
              </h2>
              <div className="space-y-4">
                {[
                  { icon: Mail, label: "Email", value: "pathforge@gmail.com" },
                  { icon: Code2, label: "GitHub", value: "github.com/pathforge" },
                  { icon: ExternalLink, label: "LinkedIn", value: "linkedin.com/company/pathforge" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className="bg-orange-500/10 p-2.5 rounded-lg">
                      <item.icon size={18} className="text-orange-500" />
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-xs">{item.label}</p>
                      <p className="text-gray-900 dark:text-white text-sm font-medium">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-2xl p-6 shadow-sm dark:shadow-none">
              <h3 className="text-gray-900 dark:text-white font-semibold mb-2">
                🚀 Want to contribute?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                PathForge is an open project. If you're a developer, designer,
                or ML enthusiast who wants to contribute, reach out!
              </p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm dark:shadow-none"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Send a Message
            </h2>

            {sent && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl mb-4 text-sm"
              >
                ✅ Message sent successfully!
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-gray-600 dark:text-gray-400 text-sm mb-1.5 block">Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name"
                    required
                    className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-600 dark:text-gray-400 text-sm mb-1.5 block">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                    required
                    className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-600 dark:text-gray-400 text-sm mb-1.5 block">Message</label>
                <div className="relative">
                  <MessageSquare size={16} className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" />
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Your message..."
                    required
                    rows={5}
                    className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition text-sm resize-none"
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.97 }}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
              >
                Send Message
                <Send size={16} />
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-8 px-6 bg-white/50 dark:bg-transparent backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-white text-xs">P</div>
            <span className="text-gray-900 dark:text-white font-bold">PathForge</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-400">
            <Link to="/" className="hover:text-gray-900 dark:hover:text-white transition">Home</Link>
            <Link to="/about" className="hover:text-gray-900 dark:hover:text-white transition">About</Link>
            <Link to="/contact" className="hover:text-gray-900 dark:hover:text-white transition">Contact</Link>
          </div>
          <p className="text-gray-500 text-sm">© 2026 PathForge</p>
        </div>
      </footer>
    </div>
  );
};

export default Contact;