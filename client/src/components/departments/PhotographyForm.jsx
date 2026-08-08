import React from "react";
import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";

const PhotographyForm = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl glass-card p-6 sm:p-8"
    >
      <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4">
        Photography Department Questions
      </h3>
      <div className="space-y-6">
        {/* Camera Gear */}
        <div className="space-y-2">
          <label className="input-label" htmlFor="cameraGear">
            Camera Gear you use
          </label>
          <input
            id="cameraGear"
            type="text"
            placeholder="Canon EOS 5D, Sony a7III..."
            {...register("cameraGear")}
            className="input-field"
          />
          {errors.cameraGear && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs">
              {errors.cameraGear.message}
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
            placeholder="https://your-photography-portfolio.com"
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

export default PhotographyForm;
