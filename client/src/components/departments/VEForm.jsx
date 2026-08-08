import React from "react";
import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";

const VEForm = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl glass-card p-6 sm:p-8"
    >
      <div className="mb-6 border-b border-border/60 pb-4">
        <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight font-sans">
          🎬 Video Editing Department Questions
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Tell us about your editing software, workflow, and showcase video links.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="input-label" htmlFor="editingSoftware">
            // Preferred Editing Software
          </label>
          <input
            id="editingSoftware"
            type="text"
            placeholder="e.g., Adobe Premiere Pro, After Effects, DaVinci Resolve, CapCut"
            {...register("editingSoftware")}
            className="input-field"
          />
          {errors.editingSoftware && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-destructive text-xs font-semibold">
              ⚠️ {errors.editingSoftware.message}
            </motion.p>
          )}
        </div>

        <div className="space-y-2">
          <label className="input-label" htmlFor="demoReelLink">
            // Demo Reel / Drive / YouTube URL (Optional)
          </label>
          <input
            id="demoReelLink"
            type="url"
            placeholder="https://drive.google.com/your-reel-link..."
            {...register("demoReelLink")}
            className="input-field"
          />
          {errors.demoReelLink && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-destructive text-xs font-semibold">
              ⚠️ {errors.demoReelLink.message}
            </motion.p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default VEForm;
