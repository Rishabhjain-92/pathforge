import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Settings as SettingsIcon, Bell, Moon, Sun, Shield, 
  Key, LogOut, Monitor, Trash2, Mail, User,
  Sparkles, ChevronRight, CheckCircle, AlertTriangle,
  Eye, Globe, Palette, BellRing, Lock, UserCircle
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

// ─── Toggle Switch ───
const Toggle = ({ enabled, onChange }) => (
  <button onClick={() => onChange(!enabled)}
    className={`w-12 h-6 rounded-full transition-all duration-300 relative flex-shrink-0 ${
      enabled 
        ? "bg-orange-500 shadow-md shadow-orange-500/25" 
        : "bg-gray-300 dark:bg-gray-700"
    }`}>
    <motion.div
      layout
      initial={false}
      animate={{ x: enabled ? 24 : 2 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm"
    />
  </button>
);

const Settings = () => {
  const { user, logout, refreshUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(user?.settings?.notifications ?? true);
  const [emailAlerts, setEmailAlerts] = useState(user?.settings?.emailAlerts ?? true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "/api/user/settings",
        { theme, notifications, emailAlerts },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await refreshUser();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      toast.success("Settings saved!", {
        style: {
          borderRadius: "16px",
          background: "rgba(17, 24, 39, 0.9)",
          color: "#fff",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(249, 115, 22, 0.2)"
        }
      });
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const themeOptions = [
    { id: "light", icon: Sun, label: "Light", desc: "Clean & bright" },
    { id: "dark", icon: Moon, label: "Dark", desc: "Easy on the eyes" },
    { id: "system", icon: Monitor, label: "System", desc: "Match your device" },
  ];

  return (
    <div className="relative min-h-screen pb-10">
      {/* ─── Ambient Blobs ─── */}
      <div className="fixed top-1/4 right-[5%] w-[350px] h-[350px] bg-gradient-to-tr from-blue-500/8 to-indigo-500/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-1/4 left-[10%] w-[350px] h-[350px] bg-gradient-to-br from-orange-500/8 to-rose-500/5 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-3xl mx-auto flex flex-col gap-6 px-2 mt-4">

        {/* ═══════ Header ═══════ */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="p-2 bg-gradient-to-br from-gray-500/15 to-gray-600/10 rounded-xl">
                <SettingsIcon size={20} className="text-gray-500 dark:text-gray-400" />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">Preferences</span>
            </div>
            <h1 className="text-gray-900 dark:text-white text-3xl font-extrabold tracking-tight">
              Settings
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 leading-relaxed">
              Manage your account preferences and personalization.
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            disabled={saving}
            onClick={handleSave}
            className={`px-7 py-3 rounded-2xl font-bold shadow-xl flex items-center gap-2.5 self-start sm:self-auto transition-all text-sm disabled:opacity-70 ${
              saved
                ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/25"
                : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-orange-500/25"
            }`}
          >
            {saving ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
            ) : saved ? (
              <CheckCircle size={16} />
            ) : null}
            {saved ? "Saved!" : "Save Changes"}
          </motion.button>
        </div>

        {/* ═══════ Account Info Card ═══════ */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-md border border-white/20 dark:border-gray-800/80 rounded-2xl p-6 shadow-xl shadow-gray-200/5 dark:shadow-none">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-rose-500 rounded-2xl flex items-center justify-center text-2xl font-extrabold text-white shadow-lg shadow-orange-500/25 flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase() || "?"}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-gray-900 dark:text-white text-lg font-bold truncate">{user?.name || "User"}</h3>
              <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500 mt-0.5">
                <Mail size={12} />
                <span className="text-sm truncate">{user?.email || "email@example.com"}</span>
              </div>
            </div>
            <button onClick={() => navigate("/profile")}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-bold rounded-xl border border-gray-200 dark:border-gray-700 transition-colors flex items-center gap-1.5 flex-shrink-0">
              Edit Profile <ChevronRight size={12} />
            </button>
          </div>
        </motion.div>

        {/* ═══════ Appearance ═══════ */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-md border border-white/20 dark:border-gray-800/80 rounded-2xl p-6 shadow-xl shadow-gray-200/5 dark:shadow-none">
          <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-gray-100 dark:border-gray-800/50">
            <div className="p-2 bg-violet-500/10 rounded-xl">
              <Palette size={18} className="text-violet-500" />
            </div>
            <div>
              <h2 className="text-gray-900 dark:text-white text-base font-bold">Appearance</h2>
              <p className="text-gray-400 dark:text-gray-500 text-[10px] font-bold uppercase tracking-wider mt-0.5">Theme preference</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {themeOptions.map(t => (
              <button key={t.id} onClick={() => setTheme(t.id)}
                className={`relative p-5 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-2.5 group ${
                  theme === t.id
                    ? "border-orange-500 bg-orange-500/5 dark:bg-orange-500/10 shadow-lg shadow-orange-500/10"
                    : "border-gray-200 dark:border-gray-700 bg-transparent hover:border-orange-500/40"
                }`}>
                {theme === t.id && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                    <CheckCircle size={12} className="text-white" />
                  </motion.div>
                )}
                <div className={`p-3 rounded-xl transition-colors ${
                  theme === t.id ? "bg-orange-500/10 text-orange-500" : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 group-hover:text-orange-500"
                }`}>
                  <t.icon size={24} />
                </div>
                <div className="text-center">
                  <span className={`text-sm font-bold block ${theme === t.id ? "text-orange-500" : "text-gray-700 dark:text-gray-300"}`}>{t.label}</span>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">{t.desc}</span>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* ═══════ Notifications ═══════ */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-md border border-white/20 dark:border-gray-800/80 rounded-2xl p-6 shadow-xl shadow-gray-200/5 dark:shadow-none">
          <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-gray-100 dark:border-gray-800/50">
            <div className="p-2 bg-blue-500/10 rounded-xl">
              <BellRing size={18} className="text-blue-500" />
            </div>
            <div>
              <h2 className="text-gray-900 dark:text-white text-base font-bold">Notifications</h2>
              <p className="text-gray-400 dark:text-gray-500 text-[10px] font-bold uppercase tracking-wider mt-0.5">Communication preferences</p>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl border border-gray-100/50 dark:border-gray-800/40">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <Bell size={16} className="text-orange-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Push Notifications</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Daily quests, roadmap updates & reminders</p>
                </div>
              </div>
              <Toggle enabled={notifications} onChange={setNotifications} />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl border border-gray-100/50 dark:border-gray-800/40">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <Mail size={16} className="text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Email Alerts</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Weekly progress reports & platform updates</p>
                </div>
              </div>
              <Toggle enabled={emailAlerts} onChange={setEmailAlerts} />
            </div>
          </div>
        </motion.div>

        {/* ═══════ Security ═══════ */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-md border border-white/20 dark:border-gray-800/80 rounded-2xl p-6 shadow-xl shadow-gray-200/5 dark:shadow-none">
          <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-gray-100 dark:border-gray-800/50">
            <div className="p-2 bg-emerald-500/10 rounded-xl">
              <Lock size={18} className="text-emerald-500" />
            </div>
            <div>
              <h2 className="text-gray-900 dark:text-white text-base font-bold">Security</h2>
              <p className="text-gray-400 dark:text-gray-500 text-[10px] font-bold uppercase tracking-wider mt-0.5">Account protection</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="flex-1 p-4 bg-gray-50/50 dark:bg-gray-800/30 hover:bg-gray-100/70 dark:hover:bg-gray-800/50 border border-gray-100/50 dark:border-gray-800/40 rounded-xl flex items-center gap-3 transition-colors group">
              <div className="p-2 bg-blue-500/10 rounded-lg group-hover:scale-110 transition-transform">
                <Key size={16} className="text-blue-500" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-gray-900 dark:text-white">Change Password</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">Update your login credentials</p>
              </div>
            </button>
            <button className="flex-1 p-4 bg-gray-50/50 dark:bg-gray-800/30 hover:bg-gray-100/70 dark:hover:bg-gray-800/50 border border-gray-100/50 dark:border-gray-800/40 rounded-xl flex items-center gap-3 transition-colors group">
              <div className="p-2 bg-violet-500/10 rounded-lg group-hover:scale-110 transition-transform">
                <Shield size={16} className="text-violet-500" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-gray-900 dark:text-white">Two-Factor Auth</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">Add an extra layer of security</p>
              </div>
            </button>
          </div>
        </motion.div>

        {/* ═══════ Danger Zone ═══════ */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-md border border-red-500/15 rounded-2xl p-6 shadow-xl shadow-gray-200/5 dark:shadow-none">
          <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-red-500/10">
            <div className="p-2 bg-red-500/10 rounded-xl">
              <AlertTriangle size={18} className="text-red-500" />
            </div>
            <div>
              <h2 className="text-red-600 dark:text-red-400 text-base font-bold">Danger Zone</h2>
              <p className="text-red-400/60 text-[10px] font-bold uppercase tracking-wider mt-0.5">Irreversible actions</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-red-500/5 border border-red-500/15 rounded-xl">
            <div>
              <p className="text-sm font-bold text-red-600 dark:text-red-400">Delete Account Permanently</p>
              <p className="text-xs text-red-500/60 mt-0.5">This will remove all your data, roadmaps, and AI analysis.</p>
            </div>
            <button className="w-full sm:w-auto px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-red-500/20 active:scale-95 flex-shrink-0">
              <Trash2 size={14} /> Delete Account
            </button>
          </div>
        </motion.div>

        {/* ═══════ Sign Out ═══════ */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <button onClick={logout}
            className="w-full p-4 bg-gray-100/60 dark:bg-gray-800/40 hover:bg-gray-200/60 dark:hover:bg-gray-700/40 border border-gray-200/50 dark:border-gray-700/50 text-gray-600 dark:text-gray-400 font-bold rounded-2xl flex items-center justify-center gap-2.5 transition-all active:scale-[0.99]">
            <LogOut size={16} /> Sign Out
          </button>
        </motion.div>

      </div>
    </div>
  );
};

export default Settings;