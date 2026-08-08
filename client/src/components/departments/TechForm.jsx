import React from "react";
import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";

const TechForm = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl glass-card p-6 sm:p-8"
    >
      <div className="mb-6 border-b border-border/60 pb-4">
        <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight font-sans">
          💻 Tech Department Questions
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Tell us about your technical skillset, stack experience, and projects.
        </p>
      </div>

      <div className="space-y-6">
        {/* Programming Languages */}
        <div className="space-y-2">
          <label className="input-label" htmlFor="programmingLanguages">
            // Preferred Programming Languages
          </label>
          <input
            id="programmingLanguages"
            type="text"
            placeholder="e.g., JavaScript, Python, C++, TypeScript"
            {...register("programmingLanguages")}
            className="input-field"
          />
          {errors.programmingLanguages && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-destructive text-xs font-semibold"
            >
              ⚠️ {errors.programmingLanguages.message}
            </motion.p>
          )}
        </div>

        {/* Frameworks */}
        <div className="space-y-2">
          <label className="input-label" htmlFor="frameworks">
            // Frameworks / Libraries (Optional)
          </label>
          <input
            id="frameworks"
            type="text"
            placeholder="e.g., React, Next.js, Node.js, Express, Django"
            {...register("frameworks")}
            className="input-field"
          />
          {errors.frameworks && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-destructive text-xs font-semibold"
            >
              ⚠️ {errors.frameworks.message}
            </motion.p>
          )}
        </div>

        {/* Projects */}
        <div className="space-y-2">
          <label className="input-label" htmlFor="projects">
            // Notable Projects & GitHub Links (Optional)
          </label>
          <textarea
            id="projects"
            rows={4}
            placeholder="Briefly describe your most important projects or share GitHub repository links..."
            {...register("projects")}
            className="input-field min-h-[110px] resize-y"
          />
          {errors.projects && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-destructive text-xs font-semibold"
            >
              ⚠️ {errors.projects.message}
            </motion.p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TechForm;
