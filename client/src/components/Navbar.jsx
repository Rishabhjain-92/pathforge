import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";


import Navbar from "../components/Navbar";
import logo from "../assets/logo.svg";          // ← your SVG logo

<Navbar logo={logo} />




const NAV_LINKS = [
  { label: "Home",    to: "/" },
  { label: "About",   to: "/about" },
  { label: "Contact", to: "/contact" },
];

const Navbar = ({ logo }) => {
  const { pathname } = useLocation();
  const [scrolled,     setScrolled]     = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);

  /* ── scroll detection ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── close mobile menu on route change ── */
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  /* ── lock body scroll when mobile menu is open ── */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-gray-950/90 backdrop-blur-2xl shadow-lg shadow-black/20 border-b border-gray-800/60"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            {logo ? (
              <motion.img
                src={logo}
                alt="PathForge logo"
                className="h-8 w-auto object-contain"
                whileHover={{ scale: 1.08, rotate: 3 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              />
            ) : (
              /* fallback pill if no logo prop passed */
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-orange-500/30 text-sm"
              >
                P
              </motion.div>
            )}
            <span className="text-white font-bold text-lg tracking-tight select-none">
              PathForge
            </span>
          </Link>

          {/* ── Desktop nav links ── */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ label, to }) => {
              const active = pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className="relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg group"
                >
                  {/* active / hover bg pill */}
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-orange-500/10 rounded-lg"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span
                    className={`relative z-10 transition-colors duration-200 ${
                      active
                        ? "text-orange-400"
                        : "text-gray-400 group-hover:text-white"
                    }`}
                  >
                    {label}
                  </span>
                  {/* underline slide */}
                  <span
                    className={`absolute bottom-1 left-4 right-4 h-px bg-orange-500/60 transition-all duration-300 origin-left ${
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* ── Desktop auth buttons ── */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="text-gray-400 hover:text-white text-sm font-medium transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-gray-800/70"
            >
              Login
            </Link>
            <Link to="/register">
              <motion.span
                whileHover={{ scale: 1.05, boxShadow: "0 8px 30px rgba(249,115,22,0.35)" }}
                whileTap={{ scale: 0.96 }}
                className="inline-block bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white text-sm font-semibold px-5 py-2 rounded-lg shadow-lg shadow-orange-500/20 cursor-pointer transition-all duration-200"
              >
                Get Started
              </motion.span>
            </Link>
          </div>

          {/* ── Mobile menu toggle ── */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/70 transition-colors duration-200"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={mobileOpen ? "close" : "open"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0,   opacity: 1 }}
                exit={{    rotate:  90, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="block"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.nav>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{    opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* drawer panel */}
            <motion.div
              key="drawer"
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{    opacity: 0, x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-gray-950 border-l border-gray-800/70 flex flex-col md:hidden shadow-2xl"
            >
              {/* drawer header */}
              <div className="flex items-center justify-between px-6 h-16 border-b border-gray-800/60">
                <div className="flex items-center gap-2.5">
                  {logo ? (
                    <img src={logo} alt="PathForge logo" className="h-7 w-auto object-contain" />
                  ) : (
                    <div className="w-7 h-7 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center font-bold text-white text-xs">P</div>
                  )}
                  <span className="text-white font-bold tracking-tight">PathForge</span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/70 transition-colors"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </motion.button>
              </div>

              {/* drawer links */}
              <nav className="flex flex-col gap-1 px-4 pt-6 flex-1">
                {NAV_LINKS.map(({ label, to }, i) => {
                  const active = pathname === to;
                  return (
                    <motion.div
                      key={to}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 + 0.1 }}
                    >
                      <Link
                        to={to}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                          active
                            ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                            : "text-gray-400 hover:text-white hover:bg-gray-800/60"
                        }`}
                      >
                        {active && (
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                        )}
                        {label}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* drawer auth buttons */}
              <div className="px-4 pb-8 flex flex-col gap-3">
                <Link
                  to="/login"
                  className="w-full text-center py-3 rounded-xl text-sm font-medium text-gray-300 hover:text-white border border-gray-700/60 hover:border-gray-600 hover:bg-gray-800/50 transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="w-full text-center py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20 hover:from-orange-400 hover:to-amber-400 transition-all duration-200"
                >
                  Get Started
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;