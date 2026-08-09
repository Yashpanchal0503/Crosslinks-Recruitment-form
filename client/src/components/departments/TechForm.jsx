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
          Tell us about your technical skillset, motivation, and share your work.
        </p>
      </div>

      <div className="space-y-6">
        {/* Q1: Motivation */}
        <div className="space-y-2">
          <label className="input-label" htmlFor="motivation">
            // What motivates you to join the Tech Department at Crosslinks? *
          </label>
          <textarea
            id="motivation"
            rows={4}
            placeholder="Tell us what drives you to join the tech team..."
            {...register("motivation")}
            className="input-field min-h-[110px] resize-y"
          />
          {errors.motivation && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-destructive text-xs font-semibold"
            >
              ⚠️ {errors.motivation.message}
            </motion.p>
          )}
        </div>

        {/* Q2: Skills */}
        <div className="space-y-2">
          <label className="input-label" htmlFor="skills">
            // Which frameworks and languages are you proficient in for Web Development? *
          </label>
          <textarea
            id="skills"
            rows={3}
            placeholder="e.g. HTML, CSS, JavaScript, React, Next.js, Node.js, Python, Django etc."
            {...register("skills")}
            className="input-field min-h-[90px] resize-y"
          />
          {errors.skills && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-destructive text-xs font-semibold"
            >
              ⚠️ {errors.skills.message}
            </motion.p>
          )}
        </div>

        {/* Q3: Portfolio/Git Link */}
        <div className="space-y-2">
          <label className="input-label" htmlFor="portfolioLink">
            // Kindly share your portfolio or any previous work you have undertaken *
          </label>
          <p className="text-[11px] text-muted-foreground mt-[-4px]">
            Share this via your Git repository and make sure it's public.
          </p>
          <input
            id="portfolioLink"
            type="text"
            placeholder="e.g., https://github.com/username/project"
            {...register("portfolioLink")}
            className="input-field"
          />
          {errors.portfolioLink && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-destructive text-xs font-semibold"
            >
              ⚠️ {errors.portfolioLink.message}
            </motion.p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TechForm;
