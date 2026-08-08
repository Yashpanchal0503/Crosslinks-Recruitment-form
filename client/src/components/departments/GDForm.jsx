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
      <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4">
        Graphic Design Department Questions
      </h3>
      <div className="space-y-6">
        {/* Tools */}
        <div className="space-y-2">
          <label className="input-label" htmlFor="tools">
            Design Tools you use (e.g., Figma, Photoshop)
          </label>
          <input
            id="tools"
            type="text"
            placeholder="Figma, Photoshop, Illustrator..."
            {...register("tools")}
            className="input-field"
          />
          {errors.tools && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs">
              {errors.tools.message}
            </motion.p>
          )}
        </div>
        {/* Portfolio Link */}
        <div className="space-y-2">
          <label className="input-label" htmlFor="portfolioLink">
            Portfolio URL (optional)
          </label>
          <input
            id="portfolioLink"
            type="url"
            placeholder="https://your-portfolio.com"
            {...register("portfolioLink")}
            className="input-field"
          />
          {errors.portfolioLink && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs">
              {errors.portfolioLink.message}
            </motion.p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default GDForm;
