import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Zap } from "lucide-react";
import logo from "../assets/logo.svg";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/60"
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <img src={logo} alt="PathForge" className="w-8 h-8" />
          <span className="text-white font-bold text-lg">PathForge</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="relative group text-sm transition-all duration-200"
              style={{
                color: location.pathname === item.path ? "white" : "#9CA3AF"
              }}
            >
              {item.label}
              <span
                className="absolute -bottom-0.5 left-0 h-px bg-orange-500 transition-all duration-300"
                style={{
                  width: location.pathname === item.path ? "100%" : "0%"
                }}
              />
            </Link>
          ))}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="text-gray-400 hover:text-white text-sm transition px-4 py-2 rounded-lg hover:bg-gray-800/70"
          >
            Login
          </Link>
          <Link to="/register">
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-medium px-4 py-2 rounded-lg cursor-pointer shadow-lg shadow-orange-500/25"
            >
              Get Started
            </motion.span>
          </Link>
        </div>

        {/* Hamburger — Mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-400 hover:text-white transition p-2"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-gray-950/95 backdrop-blur-xl border-t border-gray-800/60 overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-3">
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className="text-gray-300 hover:text-white text-sm py-2 border-b border-gray-800/50 transition"
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex gap-3 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center text-gray-300 hover:text-white text-sm py-2.5 rounded-lg bg-gray-800 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center text-white text-sm py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 font-medium"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;