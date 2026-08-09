import React, { useState } from "react";
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
  const [isSubmitTriggered, setIsSubmitTriggered] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const methods = useForm({
    mode: "onSubmit",
    resolver: async (data, context, options) => {
      let schema;
      if (stage === 1 || !isSubmitTriggered) {
        schema = personalDetailsSchema;
      } else {
        const deptSchema = getDepartmentSchema(data.department);
        schema = personalDetailsSchema.merge(deptSchema);
      }
      return zodResolver(schema)(data, context, options);
    },
    defaultValues: { campus: "Main", department: "" },
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
    setIsSubmitTriggered(false);
    setStage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = async (data) => {
    if (stage !== 2) return;
    
    // Enable Stage 2 validation
    setIsSubmitTriggered(true);
    
    // Manually trigger full form validation
    const isValid = await trigger();
    if (!isValid) {
      setTimeout(() => {
        scrollToFirstError(methods.formState.errors);
      }, 50);
      return;
    }

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
            className="tracking-tight text-5xl sm:text-7xl font-extrabold text-foreground font-sans inline-flex items-baseline justify-center gap-0 select-none"
          >
            <span className="font-druk font-bold tracking-wider">join the</span>
            <span className="font-display font-bold italic text-accent lowercase text-[1.1em] ml-4 sm:ml-5">team</span>
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

        {/* Stepper Header */}
        <div className="mb-8 p-5 sm:p-7 rounded-2xl glass-card relative overflow-hidden">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight font-sans">
                Application Progress
              </h2>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">// STEP {stage} OF 2</p>
            </div>
            <span className="px-3.5 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold font-mono">
              {stage === 1 ? "01 / 02" : "02 / 02"}
            </span>
          </div>

          {/* Stepper Progress Bar */}
          <div className="relative my-4 px-2">
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1.5 bg-muted rounded-full" />
            
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: stage === 1 ? "0%" : "100%" }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="absolute top-1/2 -translate-y-1/2 left-0 h-1.5 bg-accent rounded-full shadow-[0_0_12px_var(--accent)]"
            />

            <div className="relative flex justify-between">
              {/* Step 1 Node */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full border-2 flex items-center justify-center font-bold text-xs z-10 transition-all duration-300 ${
                    stage >= 1
                      ? "bg-accent border-accent text-accent-foreground shadow-lg shadow-accent/25"
                      : "bg-card text-muted-foreground border-border"
                  }`}
                >
                  {stage > 1 ? "✓" : "1"}
                </div>
                <span className={`text-xs font-mono mt-2 font-semibold transition-colors ${stage >= 1 ? "text-accent" : "text-muted-foreground"}`}>
                  Personal Details
                </span>
              </div>

              {/* Step 2 Node */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full border-2 flex items-center justify-center font-bold text-xs z-10 transition-all duration-300 ${
                    stage === 2
                      ? "bg-accent border-accent text-accent-foreground shadow-lg shadow-accent/25"
                      : "bg-card text-muted-foreground border-border"
                  }`}
                >
                  2
                </div>
                <span className={`text-xs font-mono mt-2 font-semibold transition-colors ${stage >= 2 ? "text-accent" : "text-muted-foreground"}`}>
                  Dept. Questions
                </span>
              </div>
            </div>
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
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
                e.preventDefault();
              }
            }}
          >
            <AnimatePresence mode="wait">
              {stage === 1 && (
                <motion.div
                  key="stage1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-6">
                    <PersonalDetails />
                    <DepartmentSelector />
                  </div>
                </motion.div>
              )}
              {stage === 2 && (
                <motion.div
                  key="stage2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderDeptForm()}
                </motion.div>
              )}
            </AnimatePresence>

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
