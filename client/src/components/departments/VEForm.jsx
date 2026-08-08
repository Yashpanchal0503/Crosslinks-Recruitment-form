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
      <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4">
        Video Editing Department Questions
      </h3>
      <div className="space-y-6">
        {/* Editing Software */}
        <div className="space-y-2">
          <label className="input-label" htmlFor="editingSoftware">
            Preferred Editing Software
          </label>
          <input
            id="editingSoftware"
            type="text"
            placeholder="Adobe Premiere, Final Cut Pro, DaVinci Resolve..."
            {...register("editingSoftware")}
            className="input-field"
          />
          {errors.editingSoftware && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs">
              {errors.editingSoftware.message}
            </motion.p>
          )}
        </div>
        {/* Demo Reel Link */}
        <div className="space-y-2">
          <label className="input-label" htmlFor="demoReelLink">
            Demo Reel URL (optional)
          </label>
          <input
            id="demoReelLink"
            type="url"
            placeholder="https://your-demo-reel.com"
            {...register("demoReelLink")}
            className="input-field"
          />
          {errors.demoReelLink && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs">
              {errors.demoReelLink.message}
            </motion.p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default VEForm;
