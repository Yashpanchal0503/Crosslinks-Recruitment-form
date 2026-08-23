import React from "react";
import { motion } from "framer-motion";
import { Clock, ExternalLink, Globe, UserCheck, MessageCircle, AlertCircle } from "lucide-react";
import Navbar from "../components/common/Navbar";
import CursorBlob from "../components/common/CursorBlob";

const pocs = [
  { name: "Reyansh", dept: "Graphic Design", phone: "9667962242" },
  { name: "Kabir Pahwa", dept: "Content", phone: "8287055126" },
  { name: "Aryan", dept: "Video Editing", phone: "9811567566" },
  { name: "Parv", dept: "Photography", phone: "9873231157" },
  { name: "Ashish", dept: "Tech", phone: "6206814632" },
];


const Application = () => {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden transition-colors duration-300">
      <CursorBlob />
      <Navbar />

      {/* Top Ambient Glow Background Circles */}
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 z-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-accent/10 blur-[140px]" />
      </div>

      <main className="max-w-3xl mx-auto pt-28 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 relative z-10">
        {/* Page Hero Header */}
        <div className="text-center mb-8 sm:mb-10">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-mono text-xs sm:text-sm text-accent font-semibold tracking-widest uppercase mb-2 inline-flex items-center gap-1.5"
          >
            <span className="inline-block w-2 h-2 rounded-full bg-accent animate-pulse" />
            // RECRUITMENTS 2026 • STATUS: CLOSED
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="tracking-tight text-4xl sm:text-6xl md:text-7xl font-extrabold text-foreground font-sans inline-flex items-baseline justify-center gap-0 select-none"
          >
            <span className="font-display font-bold tracking-tight uppercase">applications</span>
            <span className="font-instrument italic font-normal text-accent lowercase text-[1.15em] ml-3 sm:ml-4">closed</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-3 text-sm sm:text-base text-muted-foreground max-w-lg mx-auto leading-relaxed font-sans"
          >
            The recruitment drive for Crosslinks 2026 has officially wrapped up. Thank you for the overwhelming response!
          </motion.p>
        </div>

        {/* Main Status Glass Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="glass-card rounded-3xl p-6 sm:p-10 relative z-10 shadow-2xl space-y-7"
        >
          {/* Glowing Icon & Primary Status Announcement */}
          <div className="text-center">
            <div className="flex justify-center mb-5">
              <div className="w-20 h-20 rounded-full bg-accent/10 border border-accent/25 flex items-center justify-center relative shadow-[0_0_35px_var(--accent)]">
                <Clock className="w-9 h-9 text-accent" />
              </div>
            </div>

            <p className="font-mono text-xs text-accent font-semibold tracking-widest uppercase mb-1.5">
              // RECRUITMENT WINDOW CLOSED
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight font-sans mb-3">
              Sorry, you're a bit late!
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
              We have closed the applications for this tenure. Crosslinks recruits exclusively during the first year, and the recruitment window for this batch has officially concluded. Our core team is currently reviewing submissions for the next rounds.
            </p>
          </div>

          {/* Info Highlight Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-muted/40 border border-border/70 flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-mono text-accent font-semibold tracking-wider uppercase">DEADLINE PASSED</p>
                <p className="text-sm font-bold text-foreground font-sans mt-0.5">23 August, 2026</p>
                <p className="text-xs text-muted-foreground mt-0.5">Forms closed at 11:59 PM</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-muted/40 border border-border/70 flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-mono text-accent font-semibold tracking-wider uppercase">APPLICANT NOTICE</p>
                <p className="text-sm font-bold text-foreground font-sans mt-0.5">Shortlisting Underway</p>
                <p className="text-xs text-muted-foreground mt-0.5">Shortlisted applicants will receive the updates</p>
              </div>
            </div>
          </div>

          <div className="h-px bg-border/60" />

          {/* Point of Contact Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-mono text-accent font-semibold tracking-widest uppercase">// POINT OF CONTACT</p>
              <span className="text-[11px] font-mono text-muted-foreground">Already applied? Reach out for queries</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {pocs.map((poc) => (
                <a
                  key={poc.name}
                  href={`https://wa.me/91${poc.phone}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border/60 hover:border-accent/40 hover:bg-accent/5 transition-all duration-300 group cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-muted border border-border/60 flex items-center justify-center text-muted-foreground shrink-0 text-xs font-bold font-mono group-hover:bg-accent/10 group-hover:border-accent/20 group-hover:text-accent transition-colors duration-300">
                      {poc.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate group-hover:text-accent transition-colors duration-300">
                        {poc.name}
                        <span className="text-[10px] font-mono text-muted-foreground ml-1.5 group-hover:text-accent/80 transition-colors duration-300">({poc.dept})</span>
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">{poc.phone}</p>
                    </div>
                  </div>
                  <span className="text-muted-foreground group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300 shrink-0 ml-2">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div className="h-px bg-border/60" />

          {/* Action Button & External Links */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
            <p className="text-xs text-muted-foreground text-center sm:text-left leading-relaxed">
              Want to learn more about Crosslinks and our upcoming initiatives?
            </p>
            <a
              href="https://crosslinksnsut.in"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto h-11 px-6 inline-flex items-center justify-center gap-2 rounded-full bg-accent text-accent-foreground font-semibold text-sm shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:scale-105 transition-all duration-300 cursor-pointer shrink-0"
            >
              <Globe size={16} /> Visit Official Website
            </a>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Application;
