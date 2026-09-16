import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Search,
  X,
  MessageCircle,
  CheckCircle2,
  Sparkles,
  Cpu,
  Palette,
  Camera,
  Edit3,
  Video,
  UserCheck,
  AlertCircle,
  Check
} from "lucide-react";
import Navbar from "../components/common/Navbar";
import CursorBlob from "../components/common/CursorBlob";
import { getShortlistedCandidates } from "../services/api";

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



const Application = () => {
  const [selectedDept, setSelectedDept] = useState("Content");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [dbCandidates, setDbCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef(null);

  // Debounce search query by 300ms (0.3s)
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

  // Fetch shortlisted candidates from backend API
  useEffect(() => {
    let isMounted = true;
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const response = await getShortlistedCandidates();
        if (isMounted) {
          const candidates = response?.data?.candidates || [];
          const formatted = candidates.map((c) => ({
            id: c._id || c.id,
            name: c.personalDetails?.name || c.name || "Applicant",
            rollNumber: c.personalDetails?.rollNumber || c.rollNumber || "N/A",
            department: c.department,
            branch: c.personalDetails?.branch || c.branch || "",
            campus: c.personalDetails?.campus || c.campus || "",
            status: c.status || "shortlisted",
          }));
          setDbCandidates(formatted);
        }
      } catch (err) {
        console.warn("Backend API unavailable", err);
        if (isMounted) setDbCandidates([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchResults();
    return () => {
      isMounted = false;
    };
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Candidate pool from backend API only
  const allCandidates = useMemo(() => {
    return dbCandidates;
  }, [dbCandidates]);

  // Current active department metadata
  const currentDeptMeta = useMemo(() => {
    return DEPARTMENTS.find((d) => d.name === selectedDept) || DEPARTMENTS[0];
  }, [selectedDept]);

  const DeptIcon = currentDeptMeta.icon;

  // Department counts for dropdown badges
  const departmentCounts = useMemo(() => {
    const counts = {};
    DEPARTMENTS.forEach((dept) => {
      counts[dept.name] = allCandidates.filter((c) => c.department === dept.name).length;
    });
    return counts;
  }, [allCandidates]);

  // Candidates filtered by selected department and debounced search query (0.3s delay)
  const filteredCandidates = useMemo(() => {
    const query = debouncedSearchQuery.trim().toLowerCase();
    return allCandidates
      .filter((c) => c.department === selectedDept)
      .filter((c) => {
        if (!query) return true;
        const nameMatch = c.name?.toLowerCase().includes(query);
        const rollMatch = c.rollNumber?.toLowerCase().includes(query);
        return nameMatch || rollMatch;
      });
  }, [allCandidates, selectedDept, debouncedSearchQuery]);

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden transition-colors duration-300 font-sans">
      <CursorBlob />
      <Navbar />

      {/* Atmospheric Background Glow */}
      <div className="pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 w-[700px] h-[550px] rounded-full bg-accent/10 blur-[150px]" />
      <div className="pointer-events-none absolute top-[400px] -right-40 w-[450px] h-[450px] rounded-full bg-accent/5 blur-[120px]" />

      <main className="max-w-5xl mx-auto pt-28 sm:pt-36 pb-20 sm:pb-28 px-4 sm:px-6 relative z-10">
        {/* Top of Page - Hero Section */}
        <section className="flex flex-col items-center justify-center text-center mb-8 sm:mb-10 w-full">
          <div className="flex justify-center w-full mb-3.5 sm:mb-4">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-accent font-mono text-xs font-semibold tracking-wider uppercase"
            >
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              CROSSLINKS RECRUITMENTS 2026 • ROUND 1
            </motion.div>
          </div>

          {/* Main Title: Round 1 Results */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="w-full text-center tracking-tight text-4xl sm:text-6xl md:text-7xl font-extrabold text-foreground font-sans flex flex-wrap items-baseline justify-center gap-x-3.5 select-none"
          >
            <span className="font-display font-black tracking-tight uppercase">
              Round 1
            </span>
            <span className="font-instrument italic font-normal text-accent lowercase text-[1.15em]">
              results
            </span>
          </motion.h1>

          {/* Subheading Notice Box */}
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
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm sm:text-base font-medium text-foreground leading-snug">
                      The selected students will be added in WhatsApp groups soon.
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      For any query or assistance, please reach out to{" "}
                      <span className="font-semibold text-accent">Ashish</span>.
                    </p>
                  </div>
                </div>

                {/* Direct Contact Button - WhatsApp Only */}
                <div className="flex items-center shrink-0 w-full sm:w-auto justify-center">
                  <a
                    href="https://wa.me/916206814632"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 px-4 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition-all shadow-sm group cursor-pointer"
                    title="Chat with Ashish on WhatsApp (6206814632)"
                  >
                    <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>WhatsApp (6206814632)</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Interactive Controls Bar: Department Heading with Selector on Left + Search on Right (Same Level) */}
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
                      <span>Click to select department</span>
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

              {/* Right Side (On the Same Level): Live Candidate Search Bar */}
              <div className="w-full md:w-72 lg:w-80 relative flex items-center">
                <Search className="w-4 h-4 absolute left-3.5 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  id="candidate-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${selectedDept} candidates...`}
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
            {isLoading ? (
              <>
                <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                <span>Syncing live data...</span>
              </>
            ) : (
              <>
                <UserCheck className="w-3.5 h-3.5 text-accent" />
                <span>Round 1 Qualifiers</span>
              </>
            )}
          </div>
        </section>

        {/* Results List: Student Name & Roll Number Cards */}
        <section aria-label="Shortlisted candidates list">
          {isLoading ? (
            /* Shimmer Skeleton UI while data loads */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={`shimmer-${idx}`}
                  className="glass-card rounded-2xl p-4 sm:p-5 border border-border/70 flex items-center justify-between gap-3 shadow-md bg-card/85 animate-pulse"
                >
                  <div className="min-w-0 pr-2 flex-1">
                    <div className="h-5 w-40 bg-muted/80 rounded-lg mb-2.5" />
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-28 bg-muted/60 rounded-md" />
                      <div className="h-3 w-16 bg-muted/40 rounded-md" />
                    </div>
                  </div>
                  <div className="shrink-0">
                    <div className="h-7 w-20 bg-muted/50 rounded-full" />
                  </div>
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
                    transition={{ duration: 0.25, delay: idx * 0.02 }}
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
                          <span className="text-[11px] font-mono text-muted-foreground">
                            {candidate.branch}
                            {candidate.campus ? ` • ${candidate.campus}` : ""}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="shrink-0">
                      <div className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-semibold flex items-center gap-1.5 shadow-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span className="hidden xs:inline">Shortlisted</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            /* Empty State when search returns no match */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-2xl p-10 text-center border border-border/70 max-w-md mx-auto my-6"
            >
              <div className="w-12 h-12 rounded-2xl bg-muted border border-border flex items-center justify-center text-muted-foreground mx-auto mb-3">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1">
                No Shortlisted Candidates Found
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                {searchQuery
                  ? `No results match "${searchQuery}" in ${selectedDept}. Check the spelling or try searching by roll number.`
                  : `No candidates currently shortlisted under ${selectedDept}.`}
              </p>
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="h-8 px-4 rounded-xl bg-accent text-accent-foreground text-xs font-semibold cursor-pointer hover:opacity-90 transition-opacity"
                >
                  Clear Search Filter
                </button>
              )}
            </motion.div>
          )}
        </section>

        {/* Footer Banner */}
        <section className="mt-14 text-center border-t border-border/60 pt-8 pb-4">
          <p className="text-sm sm:text-base font-bold text-foreground tracking-tight font-sans">
            Congratulations for making it to Round 2!
          </p>
          <p className="text-xs text-muted-foreground mt-1.5 font-mono">
            Stay tuned for upcoming interview schedules and domain task details.
          </p>
        </section>
      </main>
    </div>
  );
};

export default Application;