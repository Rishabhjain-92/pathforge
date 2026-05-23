import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Menu, Sun, Moon } from "lucide-react";
import Sidebar from "./Sidebar";
import { useTheme } from "../context/ThemeContext";
import logo from "../assets/logo.svg";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  // Close sidebar drawer automatically when changing routes on mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-300 flex flex-col lg:flex-row">
      
      {/* Mobile Sticky Top Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800/60 flex items-center justify-between px-6 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/70 transition-colors cursor-pointer"
            aria-label="Open Sidebar"
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <img src={logo} alt="PathForge" className="w-8 h-8" />
            <span className="font-bold text-gray-900 dark:text-white">PathForge</span>
          </div>
        </div>
        
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/70 transition-colors cursor-pointer"
          aria-label="Toggle Theme"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </header>

      {/* Responsive Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <main className="flex-grow lg:ml-56 p-6 min-h-screen pt-22 lg:pt-6 w-full max-w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  );
};

export default Layout;