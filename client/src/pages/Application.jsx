import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { personalDetailsSchema, getDepartmentSchema, getDepartmentRefinement } from "../schemas/applicationSchema";
import { submitApplication } from "../services/api";
import { ArrowLeft, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PersonalDetails from "../components/common/PersonalDetails";
import DepartmentSelector from "../components/common/DepartmentSelector";
import TechForm from "../components/departments/TechForm";
import GDForm from "../components/departments/GDForm";
import PhotographyForm from "../components/departments/PhotographyForm";
import ContentForm from "../components/departments/ContentForm";
import VEForm from "../components/departments/VEForm";
import Navbar from "../components/common/Navbar";
import CursorBlob from "../components/common/CursorBlob";

const Application = () => {
  const [stage, setStage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const resolver = useMemo(() => {
    return async (data, context, options) => {
      let schema;
      if (stage === 1) {
        schema = personalDetailsSchema;
      } else {
        const deptSchema = getDepartmentSchema(data.department);
        // Merge base ZodObject schemas (safe — no ZodEffects crash)
        let merged = personalDetailsSchema.merge(deptSchema);
        // Apply conditional refinements (e.g. webDevType required when Web Dev selected)
        const refinement = getDepartmentRefinement(data.department);
        if (refinement) {
          merged = merged.superRefine(refinement);
        }
        schema = merged;
      }
      return zodResolver(schema)(data, context, options);
    };
  }, [stage]);

  const methods = useForm({
    mode: "onSubmit",
    resolver,
    defaultValues: { campus: "Main", department: "" },
    shouldUnregister: false,
  });

  const { handleSubmit, trigger, watch, clearErrors } = methods;
  const selectedDept = watch("department");

  const scrollToFirstError = (currentErrors) => {
    const errorKeys = Object.keys(currentErrors);
    if (errorKeys.length > 0) {
      const firstErrorKey = errorKeys[0];
      const element = document.getElementById(firstErrorKey) || document.getElementsByName(firstErrorKey)[0];
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => {
          element.focus({ preventScroll: true });
        }, 100);
      }
    }
  };

  const onNext = async () => {
    const isValid = await trigger([
      "fullName",
      "email",
      "rollNumber",
      "contactNumber",
      "campus",
      "branch",
      "about",
      "whyJoin",
      "department",
    ]);
    if (isValid) {
      clearErrors();
      setStage(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setTimeout(() => {
        scrollToFirstError(methods.formState.errors);
      }, 50);
    }
  };

  const onPrev = () => {
    setStage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onInvalid = (errors) => {
    setTimeout(() => {
      scrollToFirstError(errors);
    }, 50);
  };

  const onSubmit = async () => {
    if (stage !== 2) return;
    // Use getValues() to capture ALL registered fields, not the resolver-filtered data
    const data = methods.getValues();
    setIsSubmitting(true);
    setError("");
    try {
      await submitApplication(data);
      navigate("/success", { state: { name: data.fullName, department: data.department } });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit application. Please check your connection and try again.");
      setIsSubmitting(false);
    }
  };

  const renderDeptForm = () => {
    switch (selectedDept) {
      case "Tech":
        return <TechForm />;
      case "Graphic Design":
        return <GDForm />;
      case "Photography":
        return <PhotographyForm />;
      case "Content":
        return <ContentForm />;
      case "Video Editing":
        return <VEForm />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden transition-colors duration-300">
      <CursorBlob />
      <Navbar />

      {/* Top Ambient Glow Background Circles */}
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 z-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-accent/10 blur-[140px]" />
      </div>

      <main className="max-w-4xl mx-auto pt-28 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 relative z-10">
        {/* Page Hero Header */}
        <div className="text-center mb-10 sm:mb-12">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-mono text-xs sm:text-sm text-accent font-semibold tracking-widest uppercase mb-2"
          >
            // RECRUITMENTS 2026
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="tracking-tight text-4xl sm:text-6xl md:text-7xl font-extrabold text-foreground font-sans inline-flex items-baseline justify-center gap-0 select-none"
          >
            <span className="font-display font-bold tracking-tight uppercase">join the</span>
            <span className="font-instrument italic font-normal text-accent lowercase text-[1.15em] ml-3 sm:ml-4">team</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-3 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed font-sans"
          >
            Be part of NSUT's Student & Public Relations Society. Fill out the application form below to start your journey.
          </motion.p>
        </div>

        {/* Sleek Segmented Pill Stepper */}
        <div className="mb-10 max-w-2xl mx-auto">
          <div className="p-1.5 sm:p-2 rounded-full border border-accent/25 bg-card/85 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] flex items-center justify-between gap-2 relative overflow-hidden">
            {/* Step 1 Tab */}
            <button
              type="button"
              onClick={() => stage > 1 && onPrev()}
              className={`relative z-10 flex-1 py-2.5 sm:py-3 px-2.5 sm:px-4 rounded-full text-[11px] sm:text-sm font-semibold transition-colors duration-300 inline-flex items-center justify-center gap-1 sm:gap-2 cursor-pointer select-none ${
                stage === 1
                  ? "text-accent-foreground font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="font-mono text-[10px] sm:text-[11px] opacity-80 leading-none inline-block translate-y-[1px] font-normal">01.</span>
              <span className="leading-none inline-block whitespace-nowrap">Personal Details</span>
              {stage > 1 && (
                <span className="w-4 h-4 rounded-full bg-accent-foreground/20 text-accent-foreground flex items-center justify-center text-[10px] font-bold shrink-0">
                  ✓
                </span>
              )}
            </button>

            {/* Step 2 Tab */}
            <button
              type="button"
              className={`relative z-10 flex-1 py-2.5 sm:py-3 px-2.5 sm:px-4 rounded-full text-[11px] sm:text-sm font-semibold transition-colors duration-300 inline-flex items-center justify-center gap-1 sm:gap-2 select-none ${
                stage === 2
                  ? "text-accent-foreground font-bold"
                  : "text-muted-foreground"
              }`}
            >
              <span className="font-mono text-[10px] sm:text-[11px] opacity-80 leading-none inline-block translate-y-[1px] font-normal">02.</span>
              <span className="leading-none inline-block whitespace-nowrap">Dept. Questions</span>
            </button>

            {/* Sliding Pill Highlight */}
            <motion.div
              layoutId="active-step-capsule"
              className="absolute top-1.5 bottom-1.5 rounded-full bg-accent shadow-md z-0"
              initial={false}
              animate={{
                left: stage === 1 ? "0.375rem" : "calc(50% + 0.125rem)",
                width: "calc(50% - 0.5rem)",
              }}
              transition={{
                type: "spring",
                stiffness: 380,
                damping: 32,
              }}
            />
          </div>

          {/* Progress Sub-Bar */}
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 mt-3 text-[11px] font-mono text-muted-foreground">
            <span className="whitespace-nowrap">// FORM PROGRESS: <span className="">{stage === 1 ? "STEP 1 OF 2" : "STEP 2 OF 2"}</span></span>
            
            <span className="text-accent font-semibold whitespace-nowrap">{stage === 1 ? "0% COMPLETED" : "50% COMPLETED"}</span>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs sm:text-sm font-semibold flex items-center gap-3"
          >
            ⚠️ {error}
          </motion.div>
        )}

        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit, onInvalid)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
                e.preventDefault();
              }
            }}
          >
            <div className={stage === 1 ? "block space-y-6" : "hidden"}>

              {/* Deadline & POC Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="rounded-2xl glass-card p-5 sm:p-7 space-y-5"
              >
                {/* Deadline Row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    </div>
                    <div>
                      <p className="text-xs font-mono text-accent font-semibold tracking-widest uppercase">// APPLICATION DEADLINE</p>
                      <p className="text-lg sm:text-xl font-extrabold text-foreground font-sans tracking-tight mt-0.5">23 August, 2026</p>
                      <p className="text-md sm:text-l font-bold text-foreground font-sans tracking-tight mt-0.5">11:59 PM</p>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-border/60" />

                {/* About Section */}
                <div className="space-y-2">
                  <p className="text-xs font-mono text-accent font-semibold tracking-widest uppercase">// ABOUT CROSSLINKS</p>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    If you still have questions about who we are, what events we organize, or who's on the team? Check out our official website:{" "}
                    <a
                      href="https://crosslinksnsut.in"
                      target="_blank"
                      rel="noreferrer"
                      className="text-accent font-semibold hover:underline inline-flex items-center gap-1"
                    >
                      crosslinksnsut.in
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    </a>
                  </p>
                </div>

                <div className="h-px bg-border/60" />

                <div className="space-y-3">
                  <p className="text-xs font-mono text-accent font-semibold tracking-widest uppercase">// POINT OF CONTACT</p>
                  <p className="text-xs text-muted-foreground">In case of any queries, please contact:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>

              <PersonalDetails />
              <DepartmentSelector />
            </div>

            <div className={stage === 2 ? "block" : "hidden"}>
              {renderDeptForm()}
            </div>

            {/* Navigation & Submit Action Buttons styled after Alumni Meet CTA */}
            <div className="mt-10 flex items-center justify-between gap-4">
              {stage > 1 ? (
                <button
                  type="button"
                  onClick={onPrev}
                  className="h-11 sm:h-12 px-6 sm:px-7 inline-flex items-center gap-2 rounded-full border border-border bg-card text-foreground hover:bg-muted font-semibold text-sm transition-all duration-300 cursor-pointer shadow-sm"
                >
                  <ArrowLeft size={16} /> Back to Details
                </button>
              ) : (
                <div />
              )}

              {stage === 1 && (
                <button
                  key="next-btn"
                  type="button"
                  onClick={onNext}
                  data-hover-arrow="true"
                  className="h-11 sm:h-12 px-7 sm:px-8 inline-flex items-center justify-center rounded-full border border-accent/80 text-accent bg-accent/5 backdrop-blur-sm text-sm sm:text-base font-semibold transition-all duration-300 hover:bg-accent hover:text-accent-foreground hover:border-accent cursor-pointer whitespace-nowrap"
                >
                  <span>Next Step</span>
                </button>
              )}

              {stage === 2 && (
                <button
                  key="submit-btn"
                  type="submit"
                  disabled={isSubmitting}
                  data-hover-arrow="true"
                  className="h-11 sm:h-12 px-7 sm:px-8 inline-flex items-center justify-center gap-2.5 rounded-full border border-accent/80 text-accent bg-accent/5 backdrop-blur-sm text-sm sm:text-base font-semibold transition-all duration-300 hover:bg-accent hover:text-accent-foreground hover:border-accent cursor-pointer disabled:opacity-60 whitespace-nowrap"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                      <span>Submitting Application...</span>
                    </div>
                  ) : (
                    <span className="flex items-center gap-2">
                      Submit Application <Send size={16} />
                    </span>
                  )}
                </button>
              )}
            </div>
          </form>
        </FormProvider>
      </main>
    </div>
  );
};

export default Application;
