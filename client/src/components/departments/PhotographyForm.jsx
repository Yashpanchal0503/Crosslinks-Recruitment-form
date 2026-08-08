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
      <div className="mb-6 border-b border-border/60 pb-4">
        <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight font-sans">
          📸 Photography Department Questions
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Tell us about your gear and share your portfolio or Instagram handle.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="input-label" htmlFor="cameraGear">
            // Camera Gear / Phone Model You Use
          </label>
          <input
            id="cameraGear"
            type="text"
            placeholder="e.g., Canon EOS 200D, Sony a7III, iPhone 15 Pro..."
            {...register("cameraGear")}
            className="input-field"
          />
          {errors.cameraGear && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-destructive text-xs font-semibold">
              ⚠️ {errors.cameraGear.message}
            </motion.p>
          )}
        </div>

        <div className="space-y-2">
          <label className="input-label" htmlFor="portfolioLink">
            // Portfolio / Drive / Instagram URL (Optional)
          </label>
          <input
            id="portfolioLink"
            type="url"
            placeholder="https://instagram.com/yourphotography or Drive link..."
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

export default PhotographyForm;
