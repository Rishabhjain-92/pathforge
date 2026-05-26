import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Clock, MapPin, Mail, Phone, Send, X, User, MessageSquare, Sparkles } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import Navbar from "../components/Navbar";
import logo from "../assets/logo.svg";
import toast from "react-hot-toast";

// Beautiful inline SVG Brand Icons to avoid lucide-react package version mismatches
const GithubIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const Contact = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate particle positions purely client-side to prevent hydration mismatch
    const generated = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
      size: Math.random() > 0.6 ? "w-1.5 h-1.5" : "w-1 h-1",
    }));
    setParticles(generated);
  }, []);

  const themeClasses = {
    body: "bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white",
    muted: "text-gray-600 dark:text-gray-400",
    cardStatic: "bg-white/80 dark:bg-gray-900/80 border-gray-200 dark:border-gray-800/70 shadow-sm dark:shadow-none",
    input: "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700",
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setFormData({ name: "", email: "", subject: "", message: "" });
        toast.success("Message sent successfully! We'll get back to you soon. 📬", {
          style: {
            borderRadius: "16px",
            background: isDark ? "#111827" : "#ffffff",
            color: isDark ? "#ffffff" : "#1f2937",
            border: isDark ? "1px solid #374151" : "1px solid #e5e7eb",
          },
        });
      }, 1500);
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-700 ${themeClasses.body} overflow-x-hidden relative`} style={{ margin: 0, padding: 0, width: "100%", maxWidth: "100%" }}>
      <Navbar />

      {/* Ambient background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [20, -20, 20], x: [10, -10, 10] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-3xl"
        />
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={`absolute rounded-full ${isDark ? "bg-orange-400/20" : "bg-amber-500/30"} animate-pulse`}
            style={{
              left: particle.left,
              top: particle.top,
              width: particle.size === "w-1.5 h-1.5" ? "6px" : "4px",
              height: particle.size === "w-1.5 h-1.5" ? "6px" : "4px",
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full pt-32 pb-20 px-6 max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 relative z-10"
        >
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 text-orange-400 px-4 py-1.5 rounded-full text-sm mb-6">
            <Sparkles size={14} className="animate-spin" style={{ animationDuration: "3s" }} />
            Let's build something great together
          </div>
          <h1 className="text-5xl lg:text-7xl font-black mb-6 tracking-tight">
            Get In{" "}
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent inline-block">
              Touch
            </span>
          </h1>
          <p className={`text-lg md:text-xl ${themeClasses.muted} max-w-2xl mx-auto leading-relaxed`}>
            Connect with us through any of these platforms. We're always excited to discuss new opportunities, collaborations, and career paths.
          </p>
        </motion.section>

        {/* Contact Cards Grid */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mb-16"
        >
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Phone, title: "Phone", content: "+91 9214805770", description: "Available during business hours.", gradient: "from-emerald-500 to-teal-600 shadow-emerald-500/20" },
              { icon: MapPin, title: "Location", content: "Jaipur, Rajasthan, India", description: "Based in the Pink City, open to remote collaborations.", gradient: "from-orange-500 to-rose-600 shadow-orange-500/20" },
              { icon: Mail, title: "Email", content: "rishabhjain92148@gmail.com", description: "We usually respond within 24 hours.", gradient: "from-blue-500 to-indigo-600 shadow-blue-500/20" },
            ].map((contact) => {
              const Icon = contact.icon;
              return (
                <motion.div
                  key={contact.title}
                  whileHover={{ scale: 1.03, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`bg-gradient-to-br ${contact.gradient} rounded-3xl p-6 text-white relative overflow-hidden group shadow-lg cursor-default`}
                >
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{contact.title}</h3>
                    <p className="text-lg font-bold mb-1 break-all">{contact.content}</p>
                    <p className="text-white/80 text-sm leading-relaxed">{contact.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Social Links */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-20"
        >
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: InstagramIcon, title: "Instagram", href: "https://www.instagram.com/rishabh_jain921", gradient: "from-purple-500 to-pink-600 shadow-purple-500/20" },
              { icon: LinkedinIcon, title: "LinkedIn", href: "https://www.linkedin.com/in/rishabhjain92", gradient: "from-blue-600 to-indigo-700 shadow-blue-600/20" },
              { icon: GithubIcon, title: "GitHub", href: "https://github.com/Rishabhjain-92", gradient: "from-gray-800 to-gray-900 shadow-gray-800/20" },
            ].map((social) => {
              const Icon = social.icon;
              return (
                <motion.a
                  key={social.title}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.03, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`bg-gradient-to-br ${social.gradient} rounded-3xl p-6 text-white relative overflow-hidden group shadow-lg block`}
                >
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                      <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-1">{social.title}</h3>
                      <p className="text-white/80 text-sm leading-relaxed">Follow and connect on {social.title}</p>
                    </div>
                  </div>
                </motion.a>
              );
            })}
          </div>
        </motion.section>

        {/* Contact Form */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black mb-3">Send us a message</h2>
            <p className={`text-base md:text-lg ${themeClasses.muted}`}>Have a question or feedback? Fill out the form below.</p>
          </div>
          
          <div className={`${themeClasses.cardStatic} backdrop-blur-xl rounded-3xl p-8 border`}>
            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 flex items-center gap-1.5">
                    <User size={14} className="text-orange-500" /> Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 ${themeClasses.input} border rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 text-sm`}
                    placeholder="Your name"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 flex items-center gap-1.5">
                    <Mail size={14} className="text-orange-500" /> Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 ${themeClasses.input} border rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 text-sm`}
                    placeholder="your@email.com"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-orange-500" /> Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 ${themeClasses.input} border rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 text-sm`}
                  placeholder="What's this about?"
                />
                {errors.subject && <p className="text-red-500 text-xs mt-1 font-medium">{errors.subject}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center gap-1.5">
                  <MessageSquare size={14} className="text-orange-500" /> Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6}
                  className={`w-full px-4 py-3 ${themeClasses.input} border rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 text-sm resize-none`}
                  placeholder="Tell us more..."
                />
                {errors.message && <p className="text-red-500 text-xs mt-1 font-medium">{errors.message}</p>}
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="group w-full px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl font-bold text-base transition-all duration-500 hover:scale-[1.01] hover:shadow-lg hover:shadow-orange-500/20 relative overflow-hidden disabled:opacity-50 flex items-center justify-center cursor-pointer"
              >
                <span className="relative z-10 flex items-center justify-center">
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2 w-4 h-4 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
              </button>
            </form>
          </div>
        </motion.section>
      </div>

      {/* Footer - Consistent with About page */}
      <footer className="border-t border-gray-200 dark:border-gray-800/60 py-10 px-6 relative z-10 mt-10 bg-white/50 dark:bg-transparent backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <img src={logo} alt="PathForge" className="w-8 h-8" />
            <span className="text-gray-900 dark:text-white font-bold text-lg">PathForge</span>
          </Link>
          
          <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
            {["Home", "About", "Contact", "Login"].map((item) => (
              <Link
                key={item}
                to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className="hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              >
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

export default Contact;