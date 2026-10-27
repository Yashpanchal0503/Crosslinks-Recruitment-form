import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Search,
  X,
  CheckCircle2,
  Sparkles,
  Cpu,
  Palette,
  Camera,
  Edit3,
  Video,
  UserCheck,
  Check,
  ArrowRight,
  ExternalLink,
  Award,
  Trophy,
  PartyPopper,
  Layers
} from "lucide-react";
import Navbar from "../components/common/Navbar";
import CursorBlob from "../components/common/CursorBlob";
import ResultsIntro from "../components/common/ResultsIntro";
import finalRecruitmentResults from "../finalResultsConstant";

const DEPARTMENTS = [
  {
    name: "All",
    label: "All Departments",
    icon: Trophy,
    tagline: "All 2026 Inducted Members",
  },
  {
    name: "Content",
    label: "Content",
    icon: Edit3,
    tagline: "Editorial, Copywriting & Storytelling",
  },
  {
    name: "Graphic Designing",
    label: "Graphic Designing",
    icon: Palette,
    tagline: "UI/UX, Branding & Visual Art",
  },
  {
    name: "Video Editing",
    label: "Video Editing",
    icon: Video,
    tagline: "Trailers, Motion Graphics & Reels",
  },
  {
    name: "Photography",
    label: "Photography",
    icon: Camera,
    tagline: "Event Coverage, Portraits & Cinematography",
  },
  {
    name: "Tech",
    label: "Tech",
    icon: Cpu,
    tagline: "Web, App & Software Development",
  },
];

// Lightweight Celebration Confetti
const Confetti = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ["#8B5CF6", "#A78BFA", "#10B981", "#34D399", "#F59E0B", "#EC4899", "#3B82F6"];
    const particles = [];

    for (let i = 0; i < 70; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        r: Math.random() * 4 + 2,
        d: Math.random() * canvas.height,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.random() * 10 - 5,
        tiltAngleIncremental: Math.random() * 0.06 + 0.02,
        tiltAngle: 0,
      });
    }

    let elapsed = 0;
    const draw = () => {
      elapsed++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, idx) => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (Math.cos(p.d) + 2.5 + p.r / 2) / 12;
        p.x += Math.sin(p.tiltAngle);
        p.tilt = Math.sin(p.tiltAngle - idx / 3) * 12;

        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        ctx.stroke();

        if (p.y > canvas.height) {
          // Slowly taper off after 8 seconds
          if (elapsed < 480) {
            particles[idx] = {
              ...p,
              x: Math.random() * canvas.width,
              y: -15,
              tilt: Math.random() * 10 - 5,
            };
          }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none w-full h-full z-20 opacity-70"
    />
  );
};

const FinalResults = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [selectedDept, setSelectedDept] = useState("All");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleClearSearch = () => {
    setSearchQuery("");
    setDebouncedSearchQuery("");
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Department counts
  const departmentCounts = useMemo(() => {
    const counts = { All: finalRecruitmentResults.length };
    DEPARTMENTS.forEach((dept) => {
      if (dept.name !== "All") {
        counts[dept.name] = finalRecruitmentResults.filter(
          (c) => c.department.toLowerCase() === dept.name.toLowerCase()
        ).length;
      }
    });
    return counts;
  }, []);

  // Current active department metadata
  const currentDeptMeta = useMemo(() => {
    return DEPARTMENTS.find((d) => d.name === selectedDept) || DEPARTMENTS[0];
  }, [selectedDept]);

  const DeptIcon = currentDeptMeta.icon;

  // Filtered candidate list
  const filteredCandidates = useMemo(() => {
    const query = debouncedSearchQuery.trim().toLowerCase();
    return finalRecruitmentResults
      .filter((c) => {
        if (selectedDept === "All") return true;
        return c.department.toLowerCase() === selectedDept.toLowerCase();
      })
      .filter((c) => {
        if (!query) return true;
        const nameMatch = c.name?.toLowerCase().includes(query);
        const rollMatch = c.rollNumber?.toLowerCase().includes(query);
        const deptMatch = c.department?.toLowerCase().includes(query);
        return nameMatch || rollMatch || deptMatch;
      });
  }, [selectedDept, debouncedSearchQuery]);

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden transition-colors duration-300 font-sans">
      {/* Cinematic Pre-Animation Intro */}
      <AnimatePresence mode="wait">
        {showIntro && (
          <ResultsIntro onComplete={() => setShowIntro(false)} />
        )}
      </AnimatePresence>

      <CursorBlob />
      {!showIntro && <Confetti />}
      <Navbar />

      {/* Atmospheric Background Glows */}
      <div className="pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 w-[750px] h-[550px] rounded-full bg-accent/15 blur-[160px]" />
      <div className="pointer-events-none absolute top-[380px] -right-36 w-[480px] h-[480px] rounded-full bg-emerald-500/10 blur-[130px]" />
      <div className="pointer-events-none absolute top-[700px] -left-36 w-[420px] h-[420px] rounded-full bg-accent/10 blur-[130px]" />

      <main className="max-w-5xl mx-auto pt-28 sm:pt-36 pb-20 sm:pb-28 px-4 sm:px-6 relative z-10">
        
        {/* Top Hero Section */}
        <section className="flex flex-col items-center justify-center text-center mb-8 sm:mb-10 w-full">
          <div className="flex justify-center w-full mb-3.5 sm:mb-4 px-2">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full border border-accent/30 bg-accent/10 text-accent font-mono text-[10px] sm:text-xs font-semibold tracking-wider uppercase whitespace-nowrap shadow-sm"
            >
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-accent animate-pulse shrink-0" />
              <span className="hidden sm:inline">CROSSLINKS NSUT • RECRUITMENTS 2026</span>
              <span className="sm:hidden">CROSSLINKS • RECRUITMENTS 2026</span>
            </motion.div>
          </div>

          {/* Main Title: Final Results */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="w-full text-center tracking-tight text-3xl sm:text-5xl md:text-7xl font-extrabold text-foreground font-sans flex flex-wrap items-baseline justify-center gap-x-2 sm:gap-x-3.5 select-none px-2"
          >
            <span className="font-display font-black tracking-tight uppercase">
              Final
            </span>
            <span className="font-instrument italic font-normal text-accent lowercase text-[1.15em]">
              results
            </span>
          </motion.h1>

          {/* Announcement Notice Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-5 sm:mt-6 max-w-2xl w-full mx-auto"
          >
            <div className="glass-card rounded-2xl p-4 sm:p-5 border border-accent/25 shadow-lg bg-card/75 backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3.5 sm:gap-4 text-center sm:text-left">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-accent/15 border border-accent/25 flex items-center justify-center text-accent shrink-0 mt-0.5 sm:mt-0">
                    <PartyPopper className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm sm:text-base font-bold text-foreground leading-snug">
                      Welcome to CrossLinks NSUT!
                    </p>
                    <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      Congratulations to all 24 newly inducted members for the session 2026. Official onboarding details will be sent via WhatsApp.
                    </p>
                  </div>
                </div>

                <div className="flex items-center shrink-0 w-full sm:w-auto justify-center gap-2">
                  <a
                    href="https://crosslinksnsut.in"
                    target="_blank"
                    rel="noreferrer"
                    className="h-9 sm:h-10 px-4 rounded-xl bg-accent/10 border border-accent/25 text-accent text-xs font-semibold inline-flex items-center justify-center w-full sm:w-auto gap-1.5 hover:bg-accent hover:text-accent-foreground transition-all cursor-pointer"
                  >
                    <span>Society Website</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Interactive Controls Bar: Department Selector Left + Search Right */}
        <section className="mb-6 relative z-30">
          <div className="glass-card rounded-2xl p-4 sm:p-5 border border-border/70 shadow-xl bg-card/85 backdrop-blur-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              {/* Left Side: Heading with Department Name + Dropdown Selector Arrow */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  id="final-department-selector-button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-haspopup="listbox"
                  aria-expanded={dropdownOpen}
                  className="group flex items-center gap-3.5 text-left focus:outline-none cursor-pointer select-none"
                >
                  <div className="w-11 h-11 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent shadow-sm group-hover:border-accent group-hover:scale-105 transition-all">
                    <DeptIcon className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-foreground tracking-tight font-sans group-hover:text-accent transition-colors flex items-center gap-2">
                        <span>{currentDeptMeta.label}</span>
                        <ChevronDown
                          className={`w-5 h-5 sm:w-6 sm:h-6 text-accent transition-transform duration-300 ${
                            dropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      </h2>
                    </div>
                    <p className="text-xs text-muted-foreground font-mono flex items-center gap-1.5 mt-0.5">
                      <span>Click to filter domain</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-semibold">
                        {departmentCounts[selectedDept] || 0} recruited
                      </span>
                    </p>
                  </div>
                </button>

                {/* Animated Dropdown Menu displaying all department options */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.96 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="absolute top-full left-0 mt-3 w-[calc(100vw-3rem)] max-w-sm sm:w-80 rounded-2xl bg-card border border-accent/30 shadow-2xl backdrop-blur-2xl p-2 z-50 divide-y divide-border/40"
                    >
                      <div className="px-3 py-2 text-[11px] font-mono text-muted-foreground uppercase tracking-wider font-semibold">
                        Select Department
                      </div>

                      <div className="py-1 space-y-1">
                        {DEPARTMENTS.map((dept) => {
                          const IconComp = dept.icon;
                          const isSelected = selectedDept === dept.name;
                          const count = departmentCounts[dept.name] || 0;

                          return (
                            <button
                              key={dept.name}
                              type="button"
                              onClick={() => {
                                setSelectedDept(dept.name);
                                setDropdownOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-accent/15 border border-accent/30 text-accent font-semibold"
                                  : "hover:bg-muted/70 text-foreground"
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                    isSelected
                                      ? "bg-accent text-accent-foreground"
                                      : "bg-muted text-muted-foreground"
                                  }`}
                                >
                                  <IconComp className="w-4 h-4" />
                                </div>
                                <div className="truncate">
                                  <p className="text-sm font-bold truncate leading-snug">
                                    {dept.label}
                                  </p>
                                  <p className="text-[11px] text-muted-foreground truncate font-mono">
                                    {dept.tagline}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0 ml-2">
                                <span
                                  className={`text-xs font-mono px-2 py-0.5 rounded-full ${
                                    isSelected
                                      ? "bg-accent/20 text-accent font-bold"
                                      : "bg-muted text-muted-foreground"
                                  }`}
                                >
                                  {count}
                                </span>
                                {isSelected && (
                                  <Check className="w-4 h-4 text-accent" />
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Right Side: Search Box */}
              <div className="relative w-full md:w-72 flex items-center">
                <Search className="w-4 h-4 absolute left-3.5 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  id="final-candidate-search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search by name or roll no...`}
                  className="w-full bg-muted/60 hover:bg-muted/80 focus:bg-card border border-border/80 focus:border-accent rounded-xl pl-10 pr-9 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 transition-all outline-none shadow-inner"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    aria-label="Clear search"
                    className="absolute right-3 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

            </div>
          </div>
        </section>

        {/* Selected Candidates Count Header */}
        <section className="mb-4 flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <p className="text-[11px] sm:text-sm font-mono text-muted-foreground">
              Showing{" "}
              <span className="font-bold text-foreground">
                {filteredCandidates.length}
              </span>{" "}
              selected member{filteredCandidates.length === 1 ? "" : "s"}
              {selectedDept !== "All" && (
                <>
                  {" "}in <span className="text-accent font-semibold">{currentDeptMeta.label}</span>
                </>
              )}
            </p>
          </div>

          <div className="hidden xs:inline-flex items-center gap-1.5 text-xs font-mono text-accent">
            <Award className="w-3.5 h-3.5" />
            <span>Official Induction 2026</span>
          </div>
        </section>

        {/* Candidate Cards Grid */}
        <section aria-label="Final Selected candidates list">
          {filteredCandidates.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-4"
            >
              <AnimatePresence mode="popLayout">
                {filteredCandidates.map((candidate, idx) => (
                  <motion.div
                    key={`${candidate.rollNumber}-${candidate.department}-${idx}`}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25, delay: idx * 0.02 }}
                    className="glass-card rounded-2xl p-3.5 sm:p-5 border border-border/70 hover:border-emerald-500/50 transition-all duration-300 group flex items-center justify-between gap-2.5 sm:gap-3 shadow-md hover:shadow-xl bg-card/85"
                  >
                    <div className="min-w-0 pr-1.5 sm:pr-2">
                      <h3 className="text-sm sm:text-base md:text-lg font-bold text-foreground truncate group-hover:text-accent transition-colors font-sans tracking-tight">
                        {candidate.name}
                      </h3>

                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1 sm:mt-1.5">
                        <span className="font-mono text-[11px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 rounded-md bg-muted/70 text-foreground border border-border/60 tracking-wider">
                          {candidate.rollNumber}
                        </span>

                        {selectedDept === "All" && (
                          <span className="text-[10px] sm:text-[11px] font-mono text-accent/90 bg-accent/10 border border-accent/20 px-1.5 sm:px-2 py-0.5 rounded-md">
                            {candidate.department}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 px-2.5 sm:px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] sm:text-xs font-mono font-semibold shadow-sm shadow-emerald-500/10">
                      <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 text-emerald-400" />
                      <span>Selected</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="glass-card rounded-2xl p-8 sm:p-12 text-center border border-border/60 bg-card/60">
              <div className="w-12 h-12 rounded-full bg-muted/80 flex items-center justify-center mx-auto mb-3 text-muted-foreground">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-foreground mb-1">
                No matching members found
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground font-mono max-w-sm mx-auto">
                {searchQuery
                  ? `No candidate matches "${searchQuery}". Try clearing your search.`
                  : `No candidates currently listed in this domain.`}
              </p>
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="mt-4 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent font-mono text-xs font-semibold hover:bg-accent hover:text-accent-foreground transition-all cursor-pointer"
                >
                  Clear Search Filter
                </button>
              )}
            </div>
          )}
        </section>

        {/* Bottom Congratulations Footer Banner */}
        <section className="mt-10 sm:mt-12 text-center px-1">
          <div className="glass-card rounded-2xl p-4 sm:p-6 border border-border/60 bg-card/50 max-w-2xl mx-auto">
            <h4 className="text-sm sm:text-base md:text-lg font-bold text-foreground mb-1.5 leading-snug">
              <span className="inline-block">CrossLinks NSUT</span>{" "}
              <span className="text-accent">•</span>{" "}
              <span className="inline-block">Media & PR Society</span>
            </h4>
            <p className="text-[11px] sm:text-xs text-muted-foreground font-mono leading-relaxed max-w-lg mx-auto">
              Thank you to all applicants for participating in the 2026 recruitment process. Selected candidates will be contacted directly with further details.
            </p>
          </div>
        </section>

      </main>
    </div>
  );
};

export default FinalResults;
