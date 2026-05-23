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
    <div ref={ref} style={{ position: "relative" }}>
      <label style={{ color: "#9CA3AF", fontSize: "13px", display: "block", marginBottom: "6px" }}>
        {label}
      </label>
      <input
        type="text" name={name} value={value} onChange={handleInput} placeholder={placeholder}
        style={{ width: "100%", backgroundColor: "#1F2937", color: "white", padding: "11px 14px", borderRadius: "10px", border: "1px solid #374151", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
        onFocus={(e) => { e.target.style.borderColor = "#F97316"; if (value.length > 0) setShow(true); }}
        onBlur={(e) => e.target.style.borderColor = "#374151"}
      />
      <AnimatePresence>
        {show && filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
            style={{ position: "absolute", top: "100%", left: 0, right: 0, backgroundColor: "#1F2937", border: "1px solid #374151", borderRadius: "10px", marginTop: "4px", zIndex: 100, overflow: "hidden" }}
          >
            {filtered.map((s) => (
              <div key={s}
                onClick={() => { onChange({ target: { name, value: s } }); setShow(false); }}
                style={{ padding: "10px 14px", cursor: "pointer", fontSize: "13px", color: "#D1D5DB", borderBottom: "1px solid #374151" }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(249,115,22,0.1)"; e.currentTarget.style.color = "#F97316"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#D1D5DB"; }}
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
    <div style={{ position: "relative" }}>
      <div style={{ position: "fixed", top: "100px", right: "100px", width: "300px", height: "300px", background: "radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "100px", left: "300px", width: "250px", height: "250px", background: "radial-gradient(circle, rgba(96,165,250,0.05) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ color: "white", fontSize: "22px", fontWeight: "700" }}>Profile Settings</h1>
          <p style={{ color: "#6B7280", fontSize: "14px", marginTop: "4px" }}>Manage your personal information and career goals</p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "20px", alignItems: "start" }}>

          {/* Left Card */}
          <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            style={{ backgroundColor: "#111827", border: "1px solid #1F2937", borderRadius: "20px", padding: "28px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", position: "sticky", top: "20px" }}
          >
            <motion.div whileHover={{ scale: 1.05 }}
              style={{ width: "80px", height: "80px", background: "linear-gradient(135deg, #F97316, #EA580C)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", fontWeight: "700", color: "white", marginBottom: "16px", boxShadow: "0 0 30px rgba(249,115,22,0.35)" }}
            >
              {formData.name?.charAt(0).toUpperCase()}
            </motion.div>

            <p style={{ color: "white", fontWeight: "700", fontSize: "18px" }}>{formData.name}</p>
            <p style={{ color: "#6B7280", fontSize: "13px", marginTop: "4px" }}>{user?.email}</p>

            <div style={{ width: "100%", height: "1px", backgroundColor: "#1F2937", margin: "20px 0" }} />

            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { label: "Target Role", value: formData.targetRole || "Not set", color: "#60A5FA" },
                { label: "Dream Company", value: formData.targetCompany || "Not set", color: "#4ADE80" },
                { label: "Timeline", value: `${formData.timeline} months`, color: "#F97316" },
                { label: "Skills Added", value: `${formData.skills.length}`, color: "#A78BFA" },
              ].map((stat) => (
                <div key={stat.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", backgroundColor: "#1F2937", borderRadius: "10px" }}>
                  <span style={{ color: "#9CA3AF", fontSize: "13px" }}>{stat.label}</span>
                  <span style={{ color: stat.color, fontSize: "13px", fontWeight: "600", maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{stat.value}</span>
                </div>
              ))}
            </div>

            <div style={{ width: "100%", marginTop: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ color: "#9CA3AF", fontSize: "13px" }}>Profile Complete</span>
                <span style={{ color: "#F97316", fontSize: "13px", fontWeight: "600" }}>
                  {Math.min(100, [formData.name, formData.targetRole, formData.targetCompany, formData.skills.length > 0].filter(Boolean).length * 25)}%
                </span>
              </div>
              <div style={{ width: "100%", height: "6px", backgroundColor: "#1F2937", borderRadius: "999px", overflow: "hidden" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, [formData.name, formData.targetRole, formData.targetCompany, formData.skills.length > 0].filter(Boolean).length * 25)}%` }}
                  transition={{ duration: 0.8 }}
                  style={{ height: "100%", background: "linear-gradient(to right, #EA580C, #FB923C)", borderRadius: "999px" }}
                />
              </div>
            </div>
          </motion.div>

          {/* Right Side */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Personal Info */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              style={{ backgroundColor: "#111827", border: "1px solid #1F2937", borderRadius: "20px", padding: "24px" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                <div style={{ width: "32px", height: "32px", backgroundColor: "rgba(249,115,22,0.1)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <User size={16} color="#F97316" />
                </div>
                <h3 style={{ color: "white", fontSize: "16px", fontWeight: "600" }}>Personal Information</h3>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={{ color: "#9CA3AF", fontSize: "13px", display: "block", marginBottom: "7px" }}>Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange}
                    style={{ width: "100%", backgroundColor: "#1F2937", color: "white", padding: "12px 14px", borderRadius: "10px", border: "1px solid #374151", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                    onFocus={(e) => e.target.style.borderColor = "#F97316"}
                    onBlur={(e) => e.target.style.borderColor = "#374151"}
                  />
                </div>
                <div>
                  <label style={{ color: "#9CA3AF", fontSize: "13px", display: "block", marginBottom: "7px" }}>Email Address</label>
                  <input type="text" value={user?.email} disabled
                    style={{ width: "100%", backgroundColor: "#0F172A", color: "#6B7280", padding: "12px 14px", borderRadius: "10px", border: "1px solid #1F2937", fontSize: "14px", outline: "none", cursor: "not-allowed", boxSizing: "border-box" }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Career Goals */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              style={{ backgroundColor: "#111827", border: "1px solid #1F2937", borderRadius: "20px", padding: "24px" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                <div style={{ width: "32px", height: "32px", backgroundColor: "rgba(249,115,22,0.1)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Briefcase size={16} color="#F97316" />
                </div>
                <h3 style={{ color: "white", fontSize: "16px", fontWeight: "600" }}>Career Goals</h3>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "18px" }}>
                <AutoInput label="Dream Role" name="targetRole" value={formData.targetRole} onChange={handleChange} suggestions={ROLE_SUGGESTIONS} placeholder="e.g. Software Engineer" />
                <AutoInput label="Dream Company" name="targetCompany" value={formData.targetCompany} onChange={handleChange} suggestions={COMPANY_SUGGESTIONS} placeholder="e.g. Google" />
              </div>
              <div>
                <label style={{ color: "#9CA3AF", fontSize: "13px", display: "block", marginBottom: "8px" }}>
                  Timeline — <span style={{ color: "#F97316", fontWeight: "700" }}>{formData.timeline} months</span>
                </label>
                <input type="range" name="timeline" min="3" max="24" value={formData.timeline} onChange={handleChange}
                  style={{ width: "100%", accentColor: "#F97316", cursor: "pointer" }} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                  <span style={{ color: "#6B7280", fontSize: "12px" }}>3 months</span>
                  <span style={{ color: "#6B7280", fontSize: "12px" }}>24 months</span>
                </div>
              </div>
            </motion.div>

            {/* Skills */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              style={{ backgroundColor: "#111827", border: "1px solid #1F2937", borderRadius: "20px", padding: "24px" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                <div style={{ width: "32px", height: "32px", backgroundColor: "rgba(249,115,22,0.1)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Zap size={16} color="#F97316" />
                </div>
                <h3 style={{ color: "white", fontSize: "16px", fontWeight: "600" }}>Your Skills</h3>
                <span style={{ marginLeft: "auto", backgroundColor: "rgba(249,115,22,0.1)", color: "#F97316", padding: "2px 10px", borderRadius: "999px", fontSize: "12px" }}>
                  {formData.skills.length} added
                </span>
              </div>

              <div style={{ position: "relative", marginBottom: "14px" }}>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input type="text" value={skillInput} onChange={handleSkillInput}
                    onKeyDown={(e) => e.key === "Enter" && addSkill()}
                    placeholder="Type a skill and press Enter..."
                    style={{ flex: 1, backgroundColor: "#1F2937", color: "white", padding: "12px 14px", borderRadius: "10px", border: "1px solid #374151", fontSize: "14px", outline: "none" }}
                    onFocus={(e) => e.target.style.borderColor = "#F97316"}
                    onBlur={(e) => { e.target.style.borderColor = "#374151"; setTimeout(() => setShowSkillSuggestions(false), 150); }}
                  />
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => addSkill()}
                    style={{ backgroundColor: "#F97316", color: "white", padding: "12px 16px", borderRadius: "10px", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}>
                    <Plus size={18} />
                  </motion.button>
                </div>
                <AnimatePresence>
                  {showSkillSuggestions && filteredSkills.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      style={{ position: "absolute", top: "100%", left: 0, right: "56px", backgroundColor: "#1F2937", border: "1px solid #374151", borderRadius: "10px", marginTop: "4px", zIndex: 100, overflow: "hidden" }}
                    >
                      {filteredSkills.map((s) => (
                        <div key={s} onMouseDown={() => addSkill(s)}
                          style={{ padding: "10px 14px", cursor: "pointer", fontSize: "13px", color: "#D1D5DB", borderBottom: "1px solid #374151", display: "flex", alignItems: "center", gap: "8px" }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(249,115,22,0.1)"; e.currentTarget.style.color = "#F97316"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#D1D5DB"; }}
                        >
                          <Plus size={12} />{s}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", minHeight: "40px" }}>
                {formData.skills.length === 0 && (
                  <p style={{ color: "#6B7280", fontSize: "13px" }}>No skills added yet. Start typing above.</p>
                )}
                <AnimatePresence>
                  {formData.skills.map((skill) => (
                    <motion.span key={skill} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }}
                      style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.3)", color: "#FB923C", padding: "6px 12px", borderRadius: "999px", fontSize: "13px" }}
                    >
                      {skill}
                      <button onClick={() => removeSkill(skill)} style={{ background: "none", border: "none", cursor: "pointer", color: "#FB923C", display: "flex", alignItems: "center", padding: 0 }}>
                        <X size={13} />
                      </button>
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Save Button */}
            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }} onClick={handleSave} disabled={saving}
              style={{ width: "100%", backgroundColor: saved ? "#22C55E" : "#F97316", color: "white", padding: "14px", borderRadius: "14px", border: "none", fontSize: "15px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "background 0.3s", boxShadow: "0 4px 20px rgba(249,115,22,0.25)" }}
            >
              {saving ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  style={{ width: "20px", height: "20px", border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid white", borderRadius: "50%" }} />
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