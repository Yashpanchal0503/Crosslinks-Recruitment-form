import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { personalDetailsSchema, getDepartmentSchema } from "../schemas/applicationSchema";
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
        schema = personalDetailsSchema.merge(deptSchema);
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
          <div className="flex items-center justify-between px-4 mt-3 text-[11px] font-mono text-muted-foreground">
            <span>// FORM PROGRESS: {stage === 1 ? "STEP 1 OF 2" : "STEP 2 OF 2"}</span>
            <span className="text-accent font-semibold">{stage === 1 ? "0% COMPLETED" : "50% COMPLETED"}</span>
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
