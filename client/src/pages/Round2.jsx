import React, { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Palette,
  Cpu,
  Video,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  Upload,
  User,
  Hash,
  Phone,
  Sparkles,
  ShieldCheck,
  FileText,
  Camera,
  Folder,
  Code2,
  Globe
} from "lucide-react";
import Navbar from "../components/common/Navbar";
import CursorBlob from "../components/common/CursorBlob";
import { getShortlistedCandidates, submitRound2Task, checkRound2Status } from "../services/api";
import constantData from "../constant";

const DEPARTMENTS = [
  {
    id: "Graphic Design",
    shortName: "GD Task",
    name: "Graphic Design",
    icon: Palette,
    tagline: "UI/UX, Branding & Visual Art",
    description: "NSUT Wrapped Cover Redesign (Monochrome Still)",
  },
  {
    id: "Tech",
    shortName: "Tech",
    name: "Tech",
    icon: Cpu,
    tagline: "Web, App & Software Development",
    description: "NSUT Community Platform",
  },
  {
    id: "Video Editing",
    shortName: "VE",
    name: "Video Editing",
    icon: Video,
    tagline: "Trailers, Motion Graphics & Reels",
    description: "Sports Meet Reel Edit",
  },
];

const Round2 = () => {
  const navigate = useNavigate();

  // Form State
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedDept, setSelectedDept] = useState("Graphic Design");

  // Step 2 Submission Fields
  const [driveLink, setDriveLink] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [websiteLink, setWebsiteLink] = useState("");

  // UI States
  const [errors, setErrors] = useState({});
  const [isValidating, setIsValidating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verifiedCandidate, setVerifiedCandidate] = useState(null);

  // Normalization helper for department comparison
  const normalizeDept = (deptStr) => {
    if (!deptStr) return "";
    const d = deptStr.trim().toLowerCase();
    if (d.includes("gd") || d.includes("graphic")) return "Graphic Design";
    if (d.includes("tech")) return "Tech";
    if (d.includes("ve") || d.includes("video")) return "Video Editing";
    return deptStr;
  };

  // Step 1: Validate Roll Number against backend API shortlist (with constantData fallback)
  const handleValidateAndProceed = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!name.trim()) newErrors.name = "Full Name is required";
    if (!rollNumber.trim()) newErrors.rollNumber = "Roll Number is required";
    if (!phone.trim()) {
      newErrors.phone = "Phone Number is required";
    } else if (!/^\d{10}$/.test(phone.trim().replace(/\D/g, ""))) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsValidating(true);

    const cleanRoll = rollNumber.trim().toLowerCase();
    const targetDept = normalizeDept(selectedDept);

    let candidatePool = [];
    try {
      const response = await getShortlistedCandidates();
      if (response?.data?.candidates && response.data.candidates.length > 0) {
        candidatePool = response.data.candidates;
      } else {
        candidatePool = constantData;
      }
    } catch (err) {
      console.warn("Backend API unavailable, checking offline constant data", err);
      candidatePool = constantData;
    }

    // Search in candidate pool (backend DB or constantData fallback)
    const matchedCandidate = candidatePool.find((cand) => {
      const candRoll = (cand.personalDetails?.rollNumber || cand.rollNumber || "").trim().toLowerCase();
      const candDept = normalizeDept(cand.department);
      return candRoll === cleanRoll && candDept === targetDept;
    });

    if (matchedCandidate) {
      // Check if student has already submitted their Round 2 task for this roll number + department
      try {
        const statusRes = await checkRound2Status({
          rollNumber: rollNumber.trim().toUpperCase(),
          department: selectedDept,
        });
        if (statusRes?.data?.alreadySubmitted) {
          setIsValidating(false);
          setErrors({
            verification: `You have already submitted your Round 2 task for ${selectedDept}. Each candidate can submit only once per department.`,
          });
          return;
        }
      } catch (statusErr) {
        console.warn("Could not check prior submission status:", statusErr);
      }

      setIsValidating(false);
      setVerifiedCandidate({
        name: matchedCandidate.personalDetails?.name || matchedCandidate.name || name,
        rollNumber: matchedCandidate.personalDetails?.rollNumber || matchedCandidate.rollNumber || rollNumber,
        department: selectedDept,
        phone: phone,
      });
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setIsValidating(false);
      setErrors({
        verification: `Roll Number "${rollNumber.trim().toUpperCase()}" is not shortlisted for ${selectedDept} in Round 1. Please check your roll number or selected department.`,
      });
    }
  };

  // Step 2: Handle Final Task Submission
  const handleSubmitTask = async (e) => {
    e.preventDefault();
    const newErrors = {};

    const targetDept = normalizeDept(selectedDept);

    if (targetDept === "Graphic Design" || targetDept === "Video Editing") {
      if (!driveLink.trim()) {
        newErrors.driveLink = "Submission Drive Link is required";
      } else if (!/^https?:\/\/.+/i.test(driveLink.trim())) {
        newErrors.driveLink = "Please enter a valid Google Drive or web URL (starting with http:// or https://)";
      }
    } else if (targetDept === "Tech") {
      if (!githubLink.trim()) {
        newErrors.githubLink = "GitHub Repository Link is required";
      } else if (!/^https?:\/\/.+/i.test(githubLink.trim())) {
        newErrors.githubLink = "Please enter a valid GitHub URL (e.g. https://github.com/...)";
      }

      if (!websiteLink.trim()) {
        newErrors.websiteLink = "Live Website / Demo Link is required";
      } else if (!/^https?:\/\/.+/i.test(websiteLink.trim())) {
        newErrors.websiteLink = "Please enter a valid Website URL (e.g. https://...)";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const payload = {
        name: verifiedCandidate?.name || name.trim(),
        rollNumber: (verifiedCandidate?.rollNumber || rollNumber).trim().toUpperCase(),
        phone: (verifiedCandidate?.phone || phone).trim(),
        department: selectedDept,
        submissionData: {
          driveLink: driveLink.trim() || undefined,
          githubLink: githubLink.trim() || undefined,
          websiteLink: websiteLink.trim() || undefined,
        },
      };

      await submitRound2Task(payload);
      setIsSubmitting(false);

      // Navigate to success page
      navigate("/success", {
        state: {
          name: payload.name,
          department: `${selectedDept} (Round 2 Task)`,
        },
      });
    } catch (err) {
      setIsSubmitting(false);
      const msg =
        err.response?.data?.message ||
        "Failed to submit your Round 2 task. Please try again.";
      setErrors({
        submission: msg,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden transition-colors duration-300 font-sans">
      <CursorBlob />
      <Navbar />

      {/* Background Lighting Glows */}
      <div className="pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 w-[750px] h-[550px] rounded-full bg-accent/10 blur-[150px]" />
      <div className="pointer-events-none absolute top-[500px] -right-40 w-[450px] h-[450px] rounded-full bg-accent/5 blur-[120px]" />

      <main className="max-w-5xl mx-auto pt-28 sm:pt-36 pb-20 sm:pb-28 px-4 sm:px-6 relative z-10">
        
        {/* Page Hero Header */}
        <section className="text-center mb-8 sm:mb-10 w-full">
          <div className="flex justify-center w-full mb-3.5 sm:mb-4">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-accent font-mono text-xs font-semibold tracking-wider uppercase"
            >
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              CROSSLINKS RECRUITMENTS 2026 • ROUND 2 TASKS
            </motion.div>
          </div>

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
              tasks
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed font-sans"
          >
            {step === 1
              ? "Enter your details to verify your Round 1 shortlist status and unlock your department assignment."
              : "Read the task instructions carefully and submit your work link below."}
          </motion.p>
        </section>

        {/* Step Progress Stepper (Pill style matching Round 1 theme) - ABOVE POC CARD */}
        <div className="mb-8 flex items-center justify-center gap-3 select-none">
          <div
            className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full border transition-all text-xs sm:text-sm font-mono tracking-tight ${
              step === 1
                ? "border-accent bg-accent/10 text-accent font-semibold shadow-[0_0_15px_rgba(45,160,73,0.15)] ring-1 ring-accent/30"
                : "border-border/60 bg-card/60 text-muted-foreground"
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold font-mono ${
                step === 1
                  ? "bg-accent/25 border border-accent/40 text-accent"
                  : "bg-muted border border-border/60 text-muted-foreground"
              }`}
            >
              1
            </span>
            <span>Verify Eligibility</span>
          </div>

          <div className="w-8 sm:w-12 h-px bg-border/60" />

          <div
            className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full border transition-all text-xs sm:text-sm font-mono tracking-tight ${
              step === 2
                ? "border-accent bg-accent/10 text-accent font-semibold shadow-[0_0_15px_rgba(45,160,73,0.15)] ring-1 ring-accent/30"
                : "border-border/60 bg-card/60 text-muted-foreground"
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold font-mono ${
                step === 2
                  ? "bg-accent/25 border border-accent/40 text-accent"
                  : "bg-muted border border-border/60 text-muted-foreground"
              }`}
            >
              2
            </span>
            <span>Task Brief & Submit</span>
          </div>
        </div>

        {/* Deadline & POC Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8 w-full rounded-3xl glass-card p-6 sm:p-8 space-y-6 text-left border border-border/70 shadow-xl bg-card/85 backdrop-blur-xl"
        >
          {/* Deadline Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent shrink-0 shadow-xs">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-mono text-accent font-semibold tracking-widest uppercase">// APPLICATION DEADLINE</p>
                <p className="text-xl sm:text-2xl font-extrabold text-foreground font-sans tracking-tight mt-0.5">11 October, 2026</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-amber-500 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 shrink-0">
              ⏰ SUBMIT BEFORE DEADLINE
            </span>
          </div>

          <div className="h-px bg-border/60" />

          {/* About Section */}
          <div className="space-y-2">
            <p className="text-xs sm:text-sm font-mono text-accent font-semibold tracking-widest uppercase">// ABOUT CROSSLINKS</p>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              If you still have questions about who we are, what events we organize, or who's on the team? Check out our official website:{" "}
              <a
                href="https://crosslinksnsut.in"
                target="_blank"
                rel="noreferrer"
                className="text-accent font-semibold hover:underline inline-flex items-center gap-1"
              >
                crosslinksnsut.in
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </a>
            </p>
          </div>

          <div className="h-px bg-border/60" />

          {/* Point of Contact Section */}
          <div className="space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <p className="text-xs sm:text-sm font-mono text-accent font-semibold tracking-widest uppercase">// POINT OF CONTACT</p>
              <p className="text-xs font-mono text-muted-foreground">In case of any queries, contact POC</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { name: "Reyansh", dept: "Graphic Design", phone: "9667962242" },
                { name: "Kabir Pahwa", dept: "Content", phone: "8287055126" },
                { name: "Aryan", dept: "Video Editing", phone: "9811567566" },
                { name: "Parv", dept: "Photography", phone: "9873231557" },
                { name: "Ashish", dept: "Tech", phone: "6206814632" },
              ].map((poc) => (
                <a
                  key={poc.name}
                  href={`https://wa.me/91${poc.phone}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-muted/40 border border-border/70 hover:border-accent/50 hover:bg-accent/10 transition-all duration-300 group cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0 text-xs font-bold font-mono group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-300">
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
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Main Content Glass Card */}
        <AnimatePresence mode="wait">
          {step === 1 ? (
            /* STEP 1: Verification Form */
            <motion.div
              key="step-1"
              initial={{ opacity: 0, scale: 0.97, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -15 }}
              transition={{ duration: 0.3 }}
              className="glass-card rounded-3xl p-6 sm:p-10 border border-border/70 shadow-2xl relative z-10 bg-card/85 backdrop-blur-xl"
            >
              <form onSubmit={handleValidateAndProceed} className="space-y-6">
                <div>
                  <p className="font-mono text-xs sm:text-sm text-accent font-semibold tracking-widest uppercase mb-1">
                    // STEP 1: APPLICANT DETAILS
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground font-sans tracking-tight">
                    Shortlist Verification
                  </h2>
                </div>

                {/* Global Error Banner */}
                {errors.verification && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-destructive/10 border border-destructive/30 text-destructive flex items-start gap-3 text-sm sm:text-base leading-relaxed"
                  >
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold mb-0.5">Verification Failed</p>
                      <p className="opacity-90">{errors.verification}</p>
                      <div className="mt-2">
                        <Link
                          to="/"
                          className="inline-flex items-center gap-1 font-mono text-xs sm:text-sm underline hover:opacity-80 transition-opacity"
                        >
                          View Round 1 Shortlist Results <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Name Input */}
                <div>
                  <label htmlFor="name-input" className="input-label flex items-center gap-1.5 text-xs sm:text-sm">
                    <User className="w-4 h-4 text-accent" />
                    Full Name
                  </label>
                  <input
                    id="name-input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Kavya Gulati"
                    className="input-field py-3 sm:py-3.5 text-sm sm:text-base"
                  />
                  {errors.name && <p className="text-xs sm:text-sm text-destructive mt-1.5 font-mono">{errors.name}</p>}
                </div>

                {/* Roll Number Input */}
                <div>
                  <label htmlFor="roll-input" className="input-label flex items-center gap-1.5 text-xs sm:text-sm">
                    <Hash className="w-4 h-4 text-accent" />
                    Roll Number 
                  </label>
                  <input
                    id="roll-input"
                    type="text"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
                    placeholder="e.g. 2026UIT3009"
                    className="input-field py-3 sm:py-3.5 text-sm sm:text-base uppercase font-mono tracking-wider"
                  />
                  {errors.rollNumber && (
                    <p className="text-xs sm:text-sm text-destructive mt-1.5 font-mono">{errors.rollNumber}</p>
                  )}
                </div>

                {/* Phone Number Input */}
                <div>
                  <label htmlFor="phone-input" className="input-label flex items-center gap-1.5 text-xs sm:text-sm">
                    <Phone className="w-4 h-4 text-accent" />
                    Phone Number (WhatsApp) 
                  </label>
                  <input
                    id="phone-input"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="input-field py-3 sm:py-3.5 text-sm sm:text-base font-mono"
                  />
                  {errors.phone && <p className="text-xs sm:text-sm text-destructive mt-1.5 font-mono">{errors.phone}</p>}
                </div>

                {/* Department Selection Cards */}
                <div>
                  <label className="input-label flex items-center gap-1.5 mb-2.5 text-xs sm:text-sm">
                    <Sparkles className="w-4 h-4 text-accent" />
                    Select Department 
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    {DEPARTMENTS.map((dept) => {
                      const Icon = dept.icon;
                      const isSelected = selectedDept === dept.id;

                      return (
                        <button
                          key={dept.id}
                          type="button"
                          onClick={() => setSelectedDept(dept.id)}
                          className={`p-4 sm:p-5 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between gap-3 cursor-pointer ${
                            isSelected
                              ? "bg-accent/15 border-accent shadow-md shadow-accent/15 ring-1 ring-accent"
                              : "bg-muted/40 border-border/70 hover:border-accent/40 hover:bg-muted/70"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                isSelected
                                  ? "bg-accent text-accent-foreground"
                                  : "bg-muted border border-border/60 text-muted-foreground"
                              }`}
                            >
                              <Icon className="w-5 h-5" />
                            </div>

                            {isSelected && <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />}
                          </div>

                          <div>
                            <p className="text-base font-bold text-foreground font-sans">{dept.shortName}</p>
                            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 line-clamp-1">
                              {dept.tagline}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Submit Action Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isValidating}
                    className="w-full h-12 sm:h-14 rounded-full bg-accent text-accent-foreground font-extrabold text-sm sm:text-base shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isValidating ? (
                      <>
                        <span className="w-5 h-5 rounded-full border-2 border-accent-foreground/30 border-t-accent-foreground animate-spin" />
                        <span>Verifying Shortlist Status...</span>
                      </>
                    ) : (
                      <>
                        <span>Verify & Proceed to Task</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          ) : (
            /* STEP 2: Task Instructions & Submission Form */
            <motion.div
              key="step-2"
              initial={{ opacity: 0, scale: 0.97, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -15 }}
              transition={{ duration: 0.3 }}
              className="glass-card rounded-3xl p-6 sm:p-10 border border-border/70 shadow-2xl relative z-10 bg-card/85 backdrop-blur-xl space-y-8"
            >
              {/* Header Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
                <div>
                  <p className="font-mono text-xs sm:text-sm text-accent font-semibold tracking-widest uppercase mb-1">
                    // STEP 2: ROUND 2 TASK BRIEF
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground font-sans tracking-tight flex items-center gap-2">
                    <span>{selectedDept} Assignment</span>
                  </h2>
                </div>

                {/* Verified Pill Badge */}
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm font-mono font-semibold shrink-0">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Verified: {verifiedCandidate?.rollNumber}</span>
                </div>
              </div>

              {/* Department Specific Task Description & Resource Links */}
              <div className="p-6 rounded-2xl bg-muted/40 border border-border/70 space-y-4">
                <div className="flex items-center gap-2 text-accent font-mono text-xs sm:text-sm font-bold uppercase tracking-wider">
                  <FileText className="w-4 h-4" />
                  <span>Task Statement</span>
                </div>

                {/* Task Details per Department */}
                {normalizeDept(selectedDept) === "Graphic Design" && (
                  <div className="space-y-3.5">
                    <h3 className="text-lg sm:text-xl font-bold text-foreground font-sans">
                      NSUT Wrapped Cover Redesign (Monochrome Still)
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      Redesign the cover of our popular <strong>"NSUT Wrapped"</strong> series as a static, monochrome image. The previous cover was animated, so translate its key moments into a single still composition. Keep every element from the original, including texts like <span className="font-semibold text-foreground">'it's that time of the year'</span>, <strong>Netaji Subhas Palace</strong>, and other unique elements that define the design.
                    </p>

                    {/* Resources Grid */}
                    <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <a
                        href="https://drive.google.com/file/d/139KNSDVUtT9jp96UVxjLfvk5udS5_oTZ/view?usp=sharing"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3.5 rounded-xl bg-card border border-border/80 hover:border-accent/50 text-foreground hover:text-accent transition-all flex items-center justify-between text-xs sm:text-sm font-semibold group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Folder className="w-4.5 h-4.5 text-accent shrink-0" />
                          <span className="truncate">Crosslinks Logo (Drive)</span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-accent shrink-0" />
                      </a>

                      <a
                        href="https://www.instagram.com/p/DSr8oWuk5As/?img_index=1"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3.5 rounded-xl bg-card border border-border/80 hover:border-accent/50 text-foreground hover:text-accent transition-all flex items-center justify-between text-xs sm:text-sm font-semibold group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Camera className="w-4.5 h-4.5 text-accent shrink-0" />
                          <span className="truncate">Reference Instagram Post</span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-accent shrink-0" />
                      </a>
                    </div>
                  </div>
                )}

                {normalizeDept(selectedDept) === "Tech" && (
                  <div className="space-y-3.5">
                    <h3 className="text-lg sm:text-xl font-bold text-foreground font-sans">
                      NSUT Connect (Community Platform)
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      Build <strong>NSUT Connect</strong> — one place for NSUT students to discuss, get announcements, and access timetables.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      <div className="p-3.5 rounded-xl bg-card border border-border/80 text-xs sm:text-sm space-y-1">
                        <p className="font-bold font-mono text-accent">🖥️ Frontend Track</p>
                        <p className="text-muted-foreground text-xs leading-relaxed">
                          Build all pages in React with dummy data (login, feed, discussions, announcements, timetable, profile).
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-card border border-border/80 text-xs sm:text-sm space-y-1">
                        <p className="font-bold font-mono text-accent">⚡ Full-stack Track</p>
                        <p className="text-muted-foreground text-xs leading-relaxed">
                          Google login for <code className="text-accent font-semibold">@nsut.ac.in</code> accounts only, roles (student / admin), and APIs for all features.
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-card border border-border/80 text-xs sm:text-sm text-muted-foreground font-mono">
                      📱 <span className="font-bold font-mono text-accent">Mobile App Track</span> Mobile app with the same features, plus notifications and an offline timetable.
                    </div>
                  </div>
                )}

                {normalizeDept(selectedDept) === "Video Editing" && (
                  <div className="space-y-3.5">
                    <h3 className="text-lg sm:text-xl font-bold text-foreground font-sans">
                      Sports Meet Reel Edit
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      You’ll be provided with raw clips from the Sports Meet. Your task is to create a sports reel using the given footage, edited in your own style and creative direction. Feel free to experiment with pacing, music, transitions, effects, colour grading, and storytelling.
                    </p>

                    {/* Raw Clips Drive Link Button */}
                    <div className="pt-1">
                      <a
                        href="https://drive.google.com/drive/folders/1QfydxMxZpkfo2HNSCoIcW5pbdrtL593O"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3.5 rounded-xl bg-card border border-border/80 hover:border-accent/50 text-foreground hover:text-accent transition-all flex items-center justify-between text-xs sm:text-sm font-semibold group cursor-pointer max-w-md"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Folder className="w-4.5 h-4.5 text-accent shrink-0" />
                          <span className="truncate">Raw Clips: Sports Meet (Google Drive)</span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-accent shrink-0" />
                      </a>
                    </div>

                    <div className="p-3.5 rounded-xl bg-card border border-border/80 text-xs sm:text-sm text-muted-foreground font-mono">
                      📁 Once completed, upload your final edit to Google Drive and ensure <strong>"Anyone with the link"</strong> has Viewer access. Submit the link below.
                    </div>
                  </div>
                )}
              </div>

              {/* Task Submission Inputs */}
              <form onSubmit={handleSubmitTask} className="space-y-6">
                {normalizeDept(selectedDept) === "Tech" ? (
                  <>
                    <div>
                      <label htmlFor="github-input" className="input-label flex items-center gap-1.5 text-xs sm:text-sm">
                        <Code2 className="w-4 h-4 text-accent" />
                        GitHub Repository Link 
                      </label>
                      <input
                        id="github-input"
                        type="url"
                        value={githubLink}
                        onChange={(e) => setGithubLink(e.target.value)}
                        placeholder="https://github.com/your-username/nsut-community"
                        className="input-field py-3 sm:py-3.5 font-mono text-xs sm:text-sm"
                      />
                      {errors.githubLink && (
                        <p className="text-xs sm:text-sm text-destructive mt-1.5 font-mono">{errors.githubLink}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="website-input" className="input-label flex items-center gap-1.5 text-xs sm:text-sm">
                        <Globe className="w-4 h-4 text-accent" />
                        Live Website / Deployed Demo Link 
                      </label>
                      <input
                        id="website-input"
                        type="url"
                        value={websiteLink}
                        onChange={(e) => setWebsiteLink(e.target.value)}
                        placeholder="https://nsut-community.vercel.app"
                        className="input-field py-3 sm:py-3.5 font-mono text-xs sm:text-sm"
                      />
                      {errors.websiteLink && (
                        <p className="text-xs sm:text-sm text-destructive mt-1.5 font-mono">{errors.websiteLink}</p>
                      )}
                    </div>
                  </>
                ) : (
                  <div>
                    <label htmlFor="drive-input" className="input-label flex items-center gap-1.5 text-xs sm:text-sm">
                      <Folder className="w-4 h-4 text-accent" />
                      Submission Google Drive Link
                    </label>
                    <input
                      id="drive-input"
                      type="url"
                      value={driveLink}
                      onChange={(e) => setDriveLink(e.target.value)}
                      placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                      className="input-field py-3 sm:py-3.5 font-mono text-xs sm:text-sm"
                    />
                    {errors.driveLink && (
                      <p className="text-xs sm:text-sm text-destructive mt-1.5 font-mono">{errors.driveLink}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1.5 font-mono">
                      Ensure your Google Drive file permission is set to <strong>"Anyone with the link"</strong>.
                    </p>
                  </div>
                )}

                {/* Submission Error Banner */}
                {errors.submission && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 flex items-start gap-3 text-destructive text-xs sm:text-sm"
                  >
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <p className="font-mono leading-relaxed">{errors.submission}</p>
                  </motion.div>
                )}

                {/* Form Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setErrors({});
                    }}
                    className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 rounded-full border border-border/80 hover:bg-muted text-foreground font-bold text-sm sm:text-base inline-flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <ArrowLeft className="w-4.5 h-4.5" />
                    <span>Back to Step 1</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto h-12 sm:h-14 px-8 sm:px-10 rounded-full bg-accent text-accent-foreground font-extrabold text-sm sm:text-base shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:scale-105 active:scale-95 transition-all duration-300 inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-5 h-5 rounded-full border-2 border-accent-foreground/30 border-t-accent-foreground animate-spin" />
                        <span>Submitting Task...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        <span>Submit Round 2 Task</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Round2;
