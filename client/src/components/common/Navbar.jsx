import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="fixed top-3 sm:top-5 inset-x-0 z-40 px-4 sm:px-6 pointer-events-none flex justify-center">
      <div className="pointer-events-auto max-w-5xl w-full mx-auto px-4 py-2.5 sm:py-3 rounded-full border border-violet-500/20 bg-slate-950/70 backdrop-blur-xl shadow-[0_12px_32px_rgba(0,0,0,0.35)] flex items-center justify-between gap-4 transition-all duration-300">
        {/* Logo / Brand Link */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-[0_0_12px_rgba(139,92,246,0.3)]">
            <span className="font-bold text-sm text-white font-display">C</span>
          </div>
          <span className="font-display font-extrabold text-white tracking-tight text-base sm:text-lg">
            Cross<span className="text-violet-400 italic font-semibold lowercase">links</span>
          </span>
        </Link>

        {/* Portal Mono Tag */}
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 tracking-widest uppercase">
          <span className="text-violet-500/80 animate-pulse">//</span> RECRUITMENT PORTAL
        </div>
      </div>
    </header>
  );
};

export default Navbar;
