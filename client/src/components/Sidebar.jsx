import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  FileText,
  Target,
  Map,
  Star,
  BarChart2,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/profile", icon: User, label: "Profile" },
  { path: "/resume", icon: FileText, label: "Resume" },
  { path: "/skill-gap", icon: Target, label: "Skill Gap" },
  { path: "/roadmap", icon: Map, label: "My Roadmap" },
  { path: "/recommendations", icon: Star, label: "Recommendations" },
  { path: "/analytics", icon: BarChart2, label: "Analytics" },
  { path: "/settings", icon: Settings, label: "Settings" },
];

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-56 bg-gray-900 border-r border-gray-800 flex flex-col">

      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-800">
        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-white text-sm">
          P
        </div>
        <span className="text-white font-bold text-lg">PathForge</span>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                isActive
                  ? "bg-orange-500 text-white font-medium"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-all w-full"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

    </div>
  );
};

export default Sidebar;