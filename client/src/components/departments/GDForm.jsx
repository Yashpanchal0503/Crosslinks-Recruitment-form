import React from "react";
import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";

const GDForm = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl glass-card p-6 sm:p-8"
    >
      <div className="mb-6 border-b border-border/60 pb-4">
        <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight font-sans">
          🎨 Graphic Design Department Questions
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Share your design tool proficiency and portfolio link.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="input-label" htmlFor="tools">
            // Design Tools You Use
          </label>
          <input
            id="tools"
            type="text"
            placeholder="e.g., Figma, Adobe Photoshop, Illustrator, Canva"
            {...register("tools")}
            className="input-field"
          />
          {errors.tools && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-destructive text-xs font-semibold">
              ⚠️ {errors.tools.message}
            </motion.p>
          )}
        </div>

        <div className="space-y-2">
          <label className="input-label" htmlFor="portfolioLink">
            // Portfolio / Behance / Drive URL (Optional)
          </label>
          <input
            id="portfolioLink"
            type="url"
            placeholder="https://behance.net/yourname or Drive link..."
            {...register("portfolioLink")}
            className="input-field"
          />
          {errors.portfolioLink && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-destructive text-xs font-semibold">
              ⚠️ {errors.portfolioLink.message}
            </motion.p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default GDForm;
