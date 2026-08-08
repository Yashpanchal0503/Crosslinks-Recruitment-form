import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { personalDetailsSchema, getDepartmentSchema } from "../schemas/applicationSchema";
import { submitApplication } from "../services/api";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PersonalDetails from "../components/common/PersonalDetails";
import DepartmentSelector from "../components/common/DepartmentSelector";
import TechForm from "../components/departments/TechForm";
import GDForm from "../components/departments/GDForm";
import PhotographyForm from "../components/departments/PhotographyForm";
import ContentForm from "../components/departments/ContentForm";
import VEForm from "../components/departments/VEForm";

import Navbar from "../components/common/Navbar";

const Application = () => {
  const [stage, setStage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const methods = useForm({
    mode: "onTouched",
    resolver: async (data, context, options) => {
      let schema;
      if (stage === 1) {
        schema = personalDetailsSchema;
      } else {
        const deptSchema = getDepartmentSchema(data.department);
        schema = personalDetailsSchema.merge(deptSchema);
      }
      return zodResolver(schema)(data, context, options);
    },
    defaultValues: { campus: "Main", department: "" },
  });

  const { handleSubmit, trigger, watch } = methods;
  const selectedDept = watch("department");

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
      setStage(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const onPrev = () => {
    setStage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = async (data) => {
    if (stage !== 2) return;
    setIsSubmitting(true);
    setError("");
    try {
      await submitApplication(data);
      navigate("/success", { state: { name: data.fullName, department: data.department } });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-x-hidden px-4 sm:px-6 lg:px-8">
      {/* Glow effects matching reference site */}
      <div className="bg-glow-container">
        <div className="bg-glow-circle" />
        <div className="bg-glow-radial" />
      </div>

      {/* Navbar */}
      <Navbar />

      <main className="max-w-4xl mx-auto pt-28 pb-12 sm:pb-16 relative z-10">
        {/* Progress Header / Enhanced Stepper */}
        <div className="mb-10 p-6 sm:p-8 rounded-2xl bg-slate-800/40 border border-border/50 backdrop-blur-md relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Application Form</h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">// RECRUITMENT FLOW</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold">
              Step {stage} of 2
            </span>
          </div>

          {/* Enhanced Progress Bar with Nodes */}
          <div className="relative my-8 px-4">
            {/* Background Line */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 bg-slate-800 rounded-full" />
            
            {/* Progress Line */}
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: stage === 1 ? "0%" : "100%" }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="absolute top-1/2 -translate-y-1/2 left-0 h-1 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full shadow-[0_0_12px_rgba(139,92,246,0.5)]"
            />

            {/* Stepper Nodes */}
            <div className="relative flex justify-between">
              {/* Step 1 Node */}
              <div className="flex flex-col items-center">
                <motion.div
                  animate={{
                    scale: stage >= 1 ? 1.05 : 1,
                    borderColor: stage >= 1 ? "#8B5CF6" : "#475569",
                  }}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs z-10 transition-all duration-300
                    ${stage > 1 
                      ? "bg-violet-500 border-violet-500 text-white shadow-[0_0_12px_rgba(139,92,246,0.4)]" 
                      : "bg-slate-900 text-slate-300 border-slate-600"
                    }`}
                >
                  {stage > 1 ? "✓" : "1"}
                </motion.div>
                <span className={`text-[11px] font-mono mt-2.5 transition-colors duration-300 ${stage >= 1 ? "text-violet-400 font-semibold" : "text-slate-500"}`}>
                  Personal Details
                </span>
              </div>

              {/* Step 2 Node */}
              <div className="flex flex-col items-center">
                <motion.div
                  animate={{
                    scale: stage >= 2 ? 1.05 : 1,
                    borderColor: stage >= 2 ? "#8B5CF6" : "#475569",
                  }}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs z-10 transition-all duration-300
                    ${stage === 2 
                      ? "bg-slate-900 border-violet-500 text-violet-400 shadow-[0_0_12px_rgba(139,92,246,0.4)] ring-2 ring-violet-500/20" 
                      : "bg-slate-900 text-slate-500 border-slate-700"
                    }`}
                >
                  2
                </motion.div>
                <span className={`text-[11px] font-mono mt-2.5 transition-colors duration-300 ${stage >= 2 ? "text-violet-400 font-semibold" : "text-slate-500"}`}>
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
            className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3"
          >
            {error}
          </motion.div>
        )}

        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
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
            {/* Navigation Buttons */}
            <div className="mt-8 flex items-center justify-between gap-4">
              {stage > 1 ? (
                <button
                  type="button"
                  onClick={onPrev}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm text-white bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-all"
                >
                  <ArrowLeft size={16} /> Back
                </button>
              ) : (
                <div />
              )}

              {stage < 2 ? (
                <button
                  type="button"
                  onClick={onNext}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-medium text-sm px-8 py-3 rounded-xl shadow-lg shadow-violet-500/25 transition-all"
                >
                  Next Step <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-medium text-sm px-8 py-3 rounded-xl shadow-lg shadow-violet-500/25 transition-all disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Submit Application <Send size={15} /></>
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
