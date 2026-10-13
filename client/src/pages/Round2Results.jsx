import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
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
  Phone,
  Layers,
  Award
} from "lucide-react";
import Navbar from "../components/common/Navbar";
import CursorBlob from "../components/common/CursorBlob";
import { getRound2Results } from "../services/api";
import round2StaticCandidates, { getBranchFromRoll } from "../round2Constant";

const DEPARTMENTS = [
  {
    name: "Tech",
    icon: Cpu,
    tagline: "Web, App & Software Development",
  },
  {
    name: "Graphic Design",
    icon: Palette,
    tagline: "UI/UX, Branding & Visual Art",
  },
  {
    name: "Photography",
    icon: Camera,
    tagline: "Event Coverage, Portraits & Cinematography",
  },
  {
    name: "Content",
    icon: Edit3,
    tagline: "Editorial, Copywriting & Storytelling",
  },
  {
    name: "Video Editing",
    icon: Video,
    tagline: "Trailers, Motion Graphics & Reels",
  },
];

const Round2Results = () => {
  const [selectedDept, setSelectedDept] = useState("Tech");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef(null);

  // Fetch shortlisted Round 2 candidates from backend (Tech, GD, VE from admin + Content, Photography)
  useEffect(() => {
    let isMounted = true;

    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const response = await getRound2Results();
        if (isMounted) {
          const map = new Map();

          // 1. Seed with Content (49) & Photography (7) static lists
          round2StaticCandidates.forEach((c) => {
            const key = `${(c.rollNumber || "").toUpperCase().trim()}_${(c.department || "").toLowerCase().trim()}`;
            map.set(key, {
              id: key,
              name: c.name,
              rollNumber: c.rollNumber,
              department: c.department,
              branch: c.branch || getBranchFromRoll(c.rollNumber),
              status: "shortlisted",
            });
          });

          // 2. Merge backend shortlisted candidates (Tech, GD, VE from admin)
          if (response?.data?.candidates && Array.isArray(response.data.candidates)) {
            response.data.candidates.forEach((c) => {
              const key = `${(c.rollNumber || "").toUpperCase().trim()}_${(c.department || "").toLowerCase().trim()}`;
              map.set(key, {
                id: c.id || c._id || key,
                name: c.name,
                rollNumber: c.rollNumber,
                department: c.department,
                branch: c.branch || getBranchFromRoll(c.rollNumber),
                status: c.status || "shortlisted",
              });
            });
          }

          setCandidates(Array.from(map.values()));
        }
      } catch (err) {
        console.warn("Backend API unavailable, using fallback static candidates", err);
        if (isMounted) {
          setCandidates(round2StaticCandidates.map(c => ({
            ...c,
            branch: c.branch || getBranchFromRoll(c.rollNumber),
            status: "shortlisted",
          })));
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchResults();

    return () => {
      isMounted = false;
    };
  }, []);

  // Debounce search query by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

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

  // Current active department metadata
  const currentDeptMeta = useMemo(() => {
    return DEPARTMENTS.find((d) => d.name === selectedDept) || DEPARTMENTS[0];
  }, [selectedDept]);

  const DeptIcon = currentDeptMeta.icon;

  // Department counts for dropdown badges
  const departmentCounts = useMemo(() => {
    const counts = {};
    DEPARTMENTS.forEach((dept) => {
      counts[dept.name] = candidates.filter((c) => c.department.toLowerCase() === dept.name.toLowerCase()).length;
    });
    return counts;
  }, [candidates]);

  // Candidates filtered by selected department and search query
  const filteredCandidates = useMemo(() => {
    const query = debouncedSearchQuery.trim().toLowerCase();
    return candidates
      .filter((c) => c.department.toLowerCase() === selectedDept.toLowerCase())
      .filter((c) => {
        if (!query) return true;
        const nameMatch = c.name?.toLowerCase().includes(query);
        const rollMatch = c.rollNumber?.toLowerCase().includes(query);
        return nameMatch || rollMatch;
      });
  }, [candidates, selectedDept, debouncedSearchQuery]);

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden transition-colors duration-300 font-sans">
      <CursorBlob />
      <Navbar />

      {/* Atmospheric Background Glow */}
      <div className="pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 w-[700px] h-[550px] rounded-full bg-accent/10 blur-[150px]" />
      <div className="pointer-events-none absolute top-[400px] -right-40 w-[450px] h-[450px] rounded-full bg-accent/5 blur-[120px]" />

      <main className="max-w-5xl mx-auto pt-28 sm:pt-36 pb-20 sm:pb-28 px-4 sm:px-6 relative z-10">
        
        {/* Top Hero Section */}
        <section className="flex flex-col items-center justify-center text-center mb-8 sm:mb-10 w-full">
          <div className="flex justify-center w-full mb-3.5 sm:mb-4">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-accent font-mono text-xs font-semibold tracking-wider uppercase"
            >
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              CROSSLINKS RECRUITMENTS 2026 • ROUND 2
            </motion.div>
          </div>

          {/* Main Title: Round 2 Results */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="w-full text-center tracking-tight text-4xl sm:text-6xl md:text-7xl font-extrabold text-foreground font-sans flex flex-wrap items-baseline justify-center gap-x-3.5 select-none"
          >
            <span className="font-display font-black tracking-tight uppercase">
              Round 2
            </span>
            <span className="font-instrument italic font-normal text-accent lowercase text-[1.15em]">
              results
            </span>
          </motion.h1>

          {/* Round Navigation Switcher Capsule */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="mt-5 inline-flex items-center p-1.5 rounded-full bg-muted/60 border border-border/80 shadow-inner select-none"
          >
            <Link
              to="/"
              className="px-4 py-1.5 rounded-full text-xs font-mono font-medium text-muted-foreground hover:text-foreground transition-all"
            >
              Round 1 Results
            </Link>
            <div className="px-4 py-1.5 rounded-full text-xs font-mono font-bold bg-accent text-accent-foreground shadow-sm shadow-accent/20">
              Round 2 Results (Active)
            </div>
          </motion.div>

          {/* Announcement Notice Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 max-w-2xl w-full mx-auto"
          >
            <div className="glass-card rounded-2xl p-4 sm:p-5 border border-accent/25 shadow-lg bg-card/75 backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/25 flex items-center justify-center text-accent shrink-0 mt-0.5 sm:mt-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm sm:text-base font-bold text-foreground leading-snug">
                      Congratulations to all candidates shortlisted in Round 2!
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      Final interview & next stage instructions will be sent via WhatsApp & Email.
                    </p>
                  </div>
                </div>

                <div className="flex items-center shrink-0 w-full sm:w-auto justify-center gap-2">
                  <a
                    href="https://crosslinksnsut.in"
                    target="_blank"
                    rel="noreferrer"
                    className="h-10 px-4 rounded-xl bg-accent/10 border border-accent/25 text-accent text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-accent hover:text-accent-foreground transition-all cursor-pointer"
                  >
                    <span>Society Website</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Interactive Controls Bar: Department Heading Selector Left + Search Right */}
        <section className="mb-6 relative z-30">
          <div className="glass-card rounded-2xl p-4 sm:p-5 border border-border/70 shadow-xl bg-card/85 backdrop-blur-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              {/* Left Side: Heading with Department Name + Dropdown Selector Arrow */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  id="department-selector-button"
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
                        <span>{selectedDept}</span>
                        <ChevronDown
                          className={`w-5 h-5 sm:w-6 sm:h-6 text-accent transition-transform duration-300 ${
                            dropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      </h2>
                    </div>
                    <p className="text-xs text-muted-foreground font-mono flex items-center gap-1.5 mt-0.5">
                      <span>Click to change domain</span>
                      <span>•</span>
                      <span className="text-accent font-semibold">
                        {departmentCounts[selectedDept] || 0} shortlisted
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
                      className="absolute top-full left-0 mt-3 w-72 sm:w-80 rounded-2xl bg-card border border-accent/30 shadow-2xl backdrop-blur-2xl p-2 z-50 divide-y divide-border/40"
                    >
                      <div className="px-3 py-2 text-[11px] font-mono text-muted-foreground uppercase tracking-wider font-semibold">
                        Select Department
                      </div>

                      <div className="pt-1 space-y-1">
                        {DEPARTMENTS.map((dept) => {
                          const Icon = dept.icon;
                          const isSelected = dept.name === selectedDept;
                          const count = departmentCounts[dept.name] || 0;

                          return (
                            <button
                              key={dept.name}
                              type="button"
                              onClick={() => {
                                setSelectedDept(dept.name);
                                setDropdownOpen(false);
                              }}
                              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all duration-200 cursor-pointer ${
                                isSelected
                                  ? "bg-accent text-accent-foreground shadow-md shadow-accent/20"
                                  : "hover:bg-accent/10 text-foreground"
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                    isSelected
                                      ? "bg-black/20 text-white"
                                      : "bg-muted border border-border/60 text-muted-foreground"
                                  }`}
                                >
                                  <Icon className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-bold truncate">
                                    {dept.name}
                                  </p>
                                  <p
                                    className={`text-[11px] truncate ${
                                      isSelected
                                        ? "text-accent-foreground/80"
                                        : "text-muted-foreground"
                                    }`}
                                  >
                                    {dept.tagline}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                                <span
                                  className={`text-xs font-mono font-semibold px-2 py-0.5 rounded-full ${
                                    isSelected
                                      ? "bg-black/25 text-white"
                                      : "bg-muted text-muted-foreground border border-border/60"
                                  }`}
                                >
                                  {count}
                                </span>
                                {isSelected && <Check className="w-4 h-4 shrink-0" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Right Side: Live Candidate Search Bar */}
              <div className="w-full md:w-72 lg:w-80 relative flex items-center">
                <Search className="w-4 h-4 absolute left-3.5 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  id="round2-candidate-search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${selectedDept} qualifiers...`}
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

        {/* Shortlisted Candidates Count Header */}
        <section className="mb-4 flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-xs sm:text-sm font-mono text-muted-foreground">
              Showing{" "}
              <span className="font-bold text-foreground">
                {filteredCandidates.length}
              </span>{" "}
              shortlisted candidate{filteredCandidates.length === 1 ? "" : "s"} in{" "}
              <span className="text-accent font-semibold">{selectedDept}</span>
            </p>
          </div>

          <div className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
            <UserCheck className="w-3.5 h-3.5 text-accent" />
            <span>Round 2 Qualifiers</span>
          </div>
        </section>

        {/* Candidate Cards Grid */}
        <section aria-label="Round 2 Shortlisted candidates list">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={`skeleton-${idx}`}
                  className="glass-card rounded-2xl p-4 sm:p-5 border border-border/60 bg-card/60 animate-pulse space-y-3"
                >
                  <div className="h-5 w-40 bg-muted rounded-md" />
                  <div className="h-4 w-28 bg-muted/70 rounded-md" />
                </div>
              ))}
            </div>
          ) : filteredCandidates.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4"
            >
              <AnimatePresence mode="popLayout">
                {filteredCandidates.map((candidate, idx) => (
                  <motion.div
                    key={candidate.id || `${candidate.rollNumber}-${idx}`}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25, delay: idx * 0.015 }}
                    className="glass-card rounded-2xl p-4 sm:p-5 border border-border/70 hover:border-accent/60 transition-all duration-300 group flex items-center justify-between gap-3 shadow-md hover:shadow-xl bg-card/85"
                  >
                    <div className="min-w-0 pr-2">
                      <h3 className="text-base sm:text-lg font-bold text-foreground truncate group-hover:text-accent transition-colors font-sans tracking-tight">
                        {candidate.name}
                      </h3>

                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="font-mono text-xs font-semibold px-2.5 py-0.5 rounded-md bg-muted/70 text-foreground border border-border/60 tracking-wider">
                          {candidate.rollNumber}
                        </span>

                        {candidate.branch && (
                          <span className="text-[11px] font-mono text-muted-foreground truncate max-w-[180px]">
                            {candidate.branch}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-500 text-[11px] font-mono font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Round 2</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="glass-card rounded-2xl p-12 text-center border border-border/60 bg-card/60">
              <div className="w-12 h-12 rounded-full bg-muted/80 flex items-center justify-center mx-auto mb-3 text-muted-foreground">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1">
                No matching qualifiers found
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground font-mono max-w-sm mx-auto">
                {searchQuery
                  ? `No candidate matches "${searchQuery}" in ${selectedDept}. Try clearing the search or checking another domain.`
                  : `No candidates currently tagged as shortlisted in ${selectedDept}.`}
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
      </main>
    </div>
  );
};

export default Round2Results;
