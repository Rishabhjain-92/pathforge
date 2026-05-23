import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { User, Briefcase, Zap, Plus, X, Save, CheckCircle } from "lucide-react";

const SKILL_SUGGESTIONS = [
  "React", "Node.js", "MongoDB", "JavaScript", "TypeScript", "Python",
  "Express.js", "Next.js", "Tailwind CSS", "Git", "Docker", "AWS",
  "GraphQL", "REST APIs", "SQL", "PostgreSQL", "Redis", "Kubernetes",
  "Machine Learning", "Deep Learning", "TensorFlow", "scikit-learn",
  "Data Science", "Pandas", "NumPy", "Flask", "FastAPI", "Java",
  "C++", "System Design", "DSA", "Linux", "Figma", "Firebase",
];

const ROLE_SUGGESTIONS = [
  "Software Engineer", "Frontend Developer", "Backend Developer",
  "Full Stack Developer", "Data Scientist", "ML Engineer",
  "DevOps Engineer", "Product Manager", "UI/UX Designer",
  "Android Developer", "iOS Developer", "Cloud Engineer",
  "Cybersecurity Engineer", "Blockchain Developer", "Game Developer",
];

const COMPANY_SUGGESTIONS = [
  "Google", "Microsoft", "Amazon", "Apple", "Meta", "Netflix",
  "Flipkart", "Swiggy", "Zomato", "Razorpay", "CRED", "Meesho",
  "Infosys", "TCS", "Wipro", "HCL", "Cognizant", "Accenture",
  "Adobe", "Salesforce", "Uber", "Airbnb", "Twitter", "LinkedIn",
  "Atlassian", "Paytm", "PhonePe", "Ola", "Byju's", "Unacademy",
];

// ✅ AutoInput — sirf apna dropdown kaam karta hai
const AutoInput = ({ label, name, value, onChange, suggestions, placeholder }) => {
  const [show, setShow] = useState(false);
  const [filtered, setFiltered] = useState([]);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setShow(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleInput = (e) => {
    onChange(e);
    const val = e.target.value.toLowerCase();
    if (val.length > 0) {
      setFiltered(suggestions.filter(s => s.toLowerCase().includes(val)).slice(0, 5));
      setShow(true);
    } else {
      setShow(false);
    }
  };

  return (
    <div ref={ref} className="relative">
      <label className="text-gray-600 dark:text-gray-400 text-sm block mb-1.5">
        {label}
      </label>
      <input
        type="text" name={name} value={value} onChange={handleInput} placeholder={placeholder}
        className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm outline-none focus:border-orange-500 transition-colors"
        onFocus={(e) => { if (value.length > 0) setShow(true); }}
      />
      <AnimatePresence>
        {show && filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
            className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl mt-1 z-50 overflow-hidden shadow-lg"
          >
            {filtered.map((s) => (
              <div key={s}
                onClick={() => { onChange({ target: { name, value: s } }); setShow(false); }}
                className="px-4 py-2.5 cursor-pointer text-sm text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700 hover:bg-orange-50 dark:hover:bg-orange-500/10 hover:text-orange-500 dark:hover:text-orange-500 transition-colors"
              >
                {s}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ✅ Profile component
const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);
  const [filteredSkills, setFilteredSkills] = useState([]);

  const [formData, setFormData] = useState({
    name: "", targetRole: "", targetCompany: "", timeline: 12, skills: [],
  });

  // ✅ Profile component ke andar, useEffect ke bahar
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:5000/api/user/profile",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const u = res.data.user;
      setFormData({
        name: u.name || "",
        targetRole: u.targetRole || "",
        targetCompany: u.targetCompany || "",
        timeline: u.timeline || 12,
        skills: u.skills || [],
      });
    } catch (error) {
      console.error("Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  // ✅ user change hone par fresh data aayega
 useEffect(() => {
  fetchProfile();
}, [user?.skills?.length]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSkillInput = (e) => {
    const val = e.target.value;
    setSkillInput(val);
    if (val.length > 0) {
      setFilteredSkills(
        SKILL_SUGGESTIONS.filter(s =>
          s.toLowerCase().includes(val.toLowerCase()) && !formData.skills.includes(s)
        ).slice(0, 5)
      );
      setShowSkillSuggestions(true);
    } else {
      setShowSkillSuggestions(false);
    }
  };

  const addSkill = (skill) => {
    const s = skill || skillInput.trim();
    if (!s || formData.skills.includes(s)) return;
    setFormData({ ...formData, skills: [...formData.skills, s] });
    setSkillInput("");
    setShowSkillSuggestions(false);
  };

  const removeSkill = (skill) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5000/api/user/profile",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{ width: "28px", height: "28px", border: "2px solid rgba(249,115,22,0.3)", borderTop: "2px solid #F97316", borderRadius: "50%" }} />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="fixed top-[100px] right-[100px] w-[300px] h-[300px] bg-orange-500/5 dark:bg-orange-500/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed bottom-[100px] left-[300px] w-[250px] h-[250px] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="relative z-10 flex flex-col gap-5">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-gray-900 dark:text-white text-2xl font-bold">Profile Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage your personal information and career goals</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5 items-start">

          {/* Left Card */}
          <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-7 flex flex-col items-center text-center lg:sticky lg:top-5 shadow-sm dark:shadow-none"
          >
            <motion.div whileHover={{ scale: 1.05 }}
              className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-3xl font-bold text-white mb-4 shadow-lg shadow-orange-500/30"
            >
              {formData.name?.charAt(0).toUpperCase()}
            </motion.div>

            <p className="text-gray-900 dark:text-white font-bold text-lg">{formData.name}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{user?.email}</p>

            <div className="w-full h-px bg-gray-200 dark:bg-gray-800 my-5" />

            <div className="w-full flex flex-col gap-2.5">
              {[
                { label: "Target Role", value: formData.targetRole || "Not set", colorClass: "text-blue-500" },
                { label: "Dream Company", value: formData.targetCompany || "Not set", colorClass: "text-green-500" },
                { label: "Timeline", value: `${formData.timeline} months`, colorClass: "text-orange-500" },
                { label: "Skills Added", value: `${formData.skills.length}`, colorClass: "text-purple-500" },
              ].map((stat) => (
                <div key={stat.label} className="flex justify-between items-center px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">{stat.label}</span>
                  <span className={`${stat.colorClass} text-sm font-semibold max-w-[120px] truncate`}>{stat.value}</span>
                </div>
              ))}
            </div>

            <div className="w-full mt-5">
              <div className="flex justify-between mb-2">
                <span className="text-gray-500 dark:text-gray-400 text-sm">Profile Complete</span>
                <span className="text-orange-500 text-sm font-semibold">
                  {Math.min(100, [formData.name, formData.targetRole, formData.targetCompany, formData.skills.length > 0].filter(Boolean).length * 25)}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, [formData.name, formData.targetRole, formData.targetCompany, formData.skills.length > 0].filter(Boolean).length * 25)}%` }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full"
                />
              </div>
            </div>
          </motion.div>

          {/* Right Side */}
          <div className="flex flex-col gap-4">

            {/* Personal Info */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm dark:shadow-none"
            >
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 bg-orange-50 dark:bg-orange-500/10 rounded-lg flex items-center justify-center">
                  <User size={16} className="text-orange-500" />
                </div>
                <h3 className="text-gray-900 dark:text-white text-base font-semibold">Personal Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-gray-600 dark:text-gray-400 text-sm block mb-1.5">Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange}
                    className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white px-3.5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-gray-600 dark:text-gray-400 text-sm block mb-1.5">Email Address</label>
                  <input type="text" value={user?.email} disabled
                    className="w-full bg-gray-100 dark:bg-gray-800/50 text-gray-500 dark:text-gray-500 px-3.5 py-3 rounded-xl border border-gray-200 dark:border-gray-800 text-sm outline-none cursor-not-allowed"
                  />
                </div>
              </div>
            </motion.div>

            {/* Career Goals */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm dark:shadow-none"
            >
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 bg-orange-50 dark:bg-orange-500/10 rounded-lg flex items-center justify-center">
                  <Briefcase size={16} className="text-orange-500" />
                </div>
                <h3 className="text-gray-900 dark:text-white text-base font-semibold">Career Goals</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-4.5">
                <AutoInput label="Dream Role" name="targetRole" value={formData.targetRole} onChange={handleChange} suggestions={ROLE_SUGGESTIONS} placeholder="e.g. Software Engineer" />
                <AutoInput label="Dream Company" name="targetCompany" value={formData.targetCompany} onChange={handleChange} suggestions={COMPANY_SUGGESTIONS} placeholder="e.g. Google" />
              </div>
              <div className="mt-4">
                <label className="text-gray-600 dark:text-gray-400 text-sm block mb-2">
                  Timeline — <span className="text-orange-500 font-bold">{formData.timeline} months</span>
                </label>
                <input type="range" name="timeline" min="3" max="24" value={formData.timeline} onChange={handleChange}
                  className="w-full accent-orange-500 cursor-pointer" />
                <div className="flex justify-between mt-1">
                  <span className="text-gray-500 dark:text-gray-500 text-xs">3 months</span>
                  <span className="text-gray-500 dark:text-gray-500 text-xs">24 months</span>
                </div>
              </div>
            </motion.div>

            {/* Skills */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm dark:shadow-none"
            >
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 bg-orange-50 dark:bg-orange-500/10 rounded-lg flex items-center justify-center">
                  <Zap size={16} className="text-orange-500" />
                </div>
                <h3 className="text-gray-900 dark:text-white text-base font-semibold">Your Skills</h3>
                <span className="ml-auto bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-500 px-2.5 py-0.5 rounded-full text-xs">
                  {formData.skills.length} added
                </span>
              </div>

              <div className="relative mb-3.5">
                <div className="flex gap-2">
                  <input type="text" value={skillInput} onChange={handleSkillInput}
                    onKeyDown={(e) => e.key === "Enter" && addSkill()}
                    placeholder="Type a skill and press Enter..."
                    className="flex-1 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white px-3.5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm outline-none focus:border-orange-500 transition-colors"
                    onBlur={() => setTimeout(() => setShowSkillSuggestions(false), 150)}
                  />
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => addSkill()}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 rounded-xl flex items-center justify-center transition-colors">
                    <Plus size={18} />
                  </motion.button>
                </div>
                <AnimatePresence>
                  {showSkillSuggestions && filteredSkills.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="absolute top-full left-0 right-14 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl mt-1 z-50 overflow-hidden shadow-lg"
                    >
                      {filteredSkills.map((s) => (
                        <div key={s} onMouseDown={() => addSkill(s)}
                          className="px-3.5 py-2.5 cursor-pointer text-sm text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2 hover:bg-orange-50 dark:hover:bg-orange-500/10 hover:text-orange-500 dark:hover:text-orange-500 transition-colors"
                        >
                          <Plus size={12} />{s}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex flex-wrap gap-2 min-h-[40px]">
                {formData.skills.length === 0 && (
                  <p className="text-gray-500 dark:text-gray-500 text-sm">No skills added yet. Start typing above.</p>
                )}
                <AnimatePresence>
                  {formData.skills.map((skill) => (
                    <motion.span key={skill} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }}
                      className="flex items-center gap-1.5 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 text-orange-600 dark:text-orange-400 px-3 py-1.5 rounded-full text-xs font-medium"
                    >
                      {skill}
                      <button onClick={() => removeSkill(skill)} className="text-orange-500 hover:text-orange-700 dark:hover:text-orange-300 focus:outline-none flex items-center">
                        <X size={13} />
                      </button>
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Save Button */}
            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }} onClick={handleSave} disabled={saving}
              className={`w-full text-white p-3.5 rounded-xl text-base font-semibold flex items-center justify-center gap-2 transition-all shadow-md ${saved ? 'bg-green-500 hover:bg-green-600 shadow-green-500/25' : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/25'}`}
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : saved ? (
                <><CheckCircle size={18} /> Saved Successfully!</>
              ) : (
                <><Save size={18} /> Save Changes</>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;