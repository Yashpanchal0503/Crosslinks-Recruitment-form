import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import { Sun, Moon, Home } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-2.5 sm:top-5 inset-x-0 z-40 px-3 sm:px-6 pointer-events-none flex justify-center">
      <div className="pointer-events-auto max-w-5xl w-full mx-auto px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full border border-accent/20 bg-card/85 backdrop-blur-xl shadow-[0_12px_32px_rgba(0,0,0,0.25)] flex items-center justify-between gap-2 sm:gap-4 transition-all duration-300">
        
        {/* Mobile View Layout (Swaps Logo for Address Bar on Left when Scrolled) */}
        <div className="flex sm:hidden items-center justify-between w-full min-w-0 gap-2">
          <AnimatePresence mode="wait">
            {!scrolled ? (
              <motion.div
                key="mobile-logo"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
                className="flex items-center shrink-0"
              >
                <Link to="/" className="hover:opacity-90 transition-opacity cursor-pointer flex items-center shrink-0">
                  <img
                    src={theme === "dark" ? "/img/logo-black.png" : "/img/logo-white.png"}
                    alt="Crosslinks Logo"
                    className="h-8 w-auto object-contain transition-all"
                  />
                </Link>
              </motion.div>
            ) : (
              <motion.div
                key="mobile-address-bar"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
                className="flex-1 min-w-0 flex items-center justify-start pr-1"
              >
                <div className="h-7 px-3 inline-flex items-center gap-1.5 rounded-full border border-accent/35 bg-muted/70 backdrop-blur-md shadow-sm whitespace-nowrap select-none max-w-[220px]">
                  <span className="p-0.5 rounded-full flex items-center justify-center shrink-0">
                    <Home className="h-3.5 w-3.5 text-accent shrink-0" />
                  </span>
                  <span className="truncate text-[11px] font-mono text-foreground/90 tracking-tight">
                    crosslinks/recruitments-2026
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Theme Toggle Button (Mobile) */}
          <button
            aria-label="Toggle theme"
            type="button"
            onClick={toggleTheme}
            className="h-8 w-8 inline-flex items-center justify-center rounded-full hover:bg-accent/15 text-accent transition-colors cursor-pointer shrink-0"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Desktop View Layout (Logo Left, Address Bar Center, Theme Toggle Right) */}
        <div className="hidden sm:flex items-center justify-between w-full min-w-0 gap-4">
          {/* Left: Brand Logo */}
          <Link to="/" className="hover:opacity-90 transition-opacity cursor-pointer flex items-center shrink-0">
            <img
              src={theme === "dark" ? "/img/logo-black.png" : "/img/logo-white.png"}
              alt="Crosslinks Logo"
              className="h-9 w-auto object-contain transition-all"
            />
          </Link>

          {/* Center: Centered Dummy Address Bar Capsule Pill */}
          <div className="flex-1 flex justify-center px-2 min-w-0">
            <div className="h-8 px-4 inline-flex items-center justify-center gap-2 rounded-full border border-accent/35 bg-muted/70 backdrop-blur-md shadow-sm whitespace-nowrap select-none max-w-xs">
              <span className="p-0.5 rounded-full flex items-center justify-center shrink-0">
                <Home className="h-3.5 w-3.5 text-accent shrink-0" />
              </span>
              <span className="truncate text-xs font-mono text-foreground/90 tracking-tight">
                crosslinks/recruitments-2026
              </span>
            </div>
          </div>

          {/* Right: Theme Toggle Button (Desktop) */}
          <div className="shrink-0 flex items-center">
            <button
              aria-label="Toggle theme"
              type="button"
              onClick={toggleTheme}
              className="h-9 w-9 inline-flex items-center justify-center rounded-full hover:bg-accent/15 text-accent transition-colors cursor-pointer shrink-0"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Navbar;
