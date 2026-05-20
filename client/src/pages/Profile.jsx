import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { User, Briefcase, Building, Plus, X } from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [skillInput, setSkillInput] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    targetRole: "",
    targetCompany: "",
    timeline: 12,
    skills: [],
  });

  // Fetch profile on page load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/api/user/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
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
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add skill
  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed) return;
    if (formData.skills.includes(trimmed)) return;
    setFormData({ ...formData, skills: [...formData.skills, trimmed] });
    setSkillInput("");
  };

  // Remove skill
  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skillToRemove),
    });
  };

  // Handle enter key on skill input
  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  // Save profile
  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5000/api/user/profile",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage("Profile saved successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch {
      setMessage("Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">

      {/* Header */}
      <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
      <p className="text-gray-400 mt-1 mb-6">
        Manage your personal information and career goals
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Left Card — Avatar + Stats */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4">
            {formData.name?.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-white font-semibold text-lg">{formData.name}</h2>
          <p className="text-gray-400 text-sm mt-1">{user?.email}</p>

          <div className="w-full mt-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Target Role</span>
              <span className="text-white font-medium">
                {formData.targetRole || "Not set"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Target Company</span>
              <span className="text-white font-medium">
                {formData.targetCompany || "Not set"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Timeline</span>
              <span className="text-orange-500 font-medium">
                {formData.timeline} months
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Skills</span>
              <span className="text-white font-medium">
                {formData.skills.length}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side — Edit Form */}
        <div className="md:col-span-2 space-y-4">

          {/* Personal Info */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <User size={18} className="text-orange-500" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-sm mb-1 block">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-gray-800 text-white px-4 py-2.5 rounded-lg border border-gray-700 focus:outline-none focus:border-orange-500 text-sm"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">
                  Email
                </label>
                <input
                  type="text"
                  value={user?.email}
                  disabled
                  className="w-full bg-gray-800 text-gray-500 px-4 py-2.5 rounded-lg border border-gray-700 text-sm cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Career Goals */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Briefcase size={18} className="text-orange-500" />
              Career Goals
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-sm mb-1 block">
                  Dream Role
                </label>
                <input
                  type="text"
                  name="targetRole"
                  value={formData.targetRole}
                  onChange={handleChange}
                  placeholder="e.g. Software Engineer"
                  className="w-full bg-gray-800 text-white px-4 py-2.5 rounded-lg border border-gray-700 focus:outline-none focus:border-orange-500 text-sm"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">
                  Dream Company
                </label>
                <input
                  type="text"
                  name="targetCompany"
                  value={formData.targetCompany}
                  onChange={handleChange}
                  placeholder="e.g. Google"
                  className="w-full bg-gray-800 text-white px-4 py-2.5 rounded-lg border border-gray-700 focus:outline-none focus:border-orange-500 text-sm"
                />
              </div>
            </div>

            {/* Timeline Slider */}
            <div className="mt-4">
              <label className="text-gray-400 text-sm mb-1 block">
                Timeline —{" "}
                <span className="text-orange-500 font-medium">
                  {formData.timeline} months
                </span>
              </label>
              <input
                type="range"
                name="timeline"
                min="3"
                max="24"
                value={formData.timeline}
                onChange={handleChange}
                className="w-full accent-orange-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>3 months</span>
                <span>24 months</span>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Building size={18} className="text-orange-500" />
              Your Skills
            </h3>

            {/* Skill Input */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                placeholder="Type a skill and press Enter"
                className="flex-1 bg-gray-800 text-white px-4 py-2.5 rounded-lg border border-gray-700 focus:outline-none focus:border-orange-500 text-sm"
              />
              <button
                onClick={addSkill}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg transition"
              >
                <Plus size={18} />
              </button>
            </div>

            {/* Skill Tags */}
            <div className="flex flex-wrap gap-2">
              {formData.skills.length === 0 && (
                <p className="text-gray-500 text-sm">
                  No skills added yet. Add your first skill above.
                </p>
              )}
              {formData.skills.map((skill) => (
                <span
                  key={skill}
                  className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/30 text-orange-400 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="hover:text-white transition"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Save Button */}
          {message && (
            <div className={`px-4 py-3 rounded-lg text-sm ${
              message.includes("success")
                ? "bg-green-500/10 border border-green-500 text-green-400"
                : "bg-red-500/10 border border-red-500 text-red-400"
            }`}>
              {message}
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

        </div>
      </div>
    </div>
  );
};

export default Profile;