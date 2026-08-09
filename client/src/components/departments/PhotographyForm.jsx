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
          Tell us about your gear and share your portfolio work.
        </p>
      </div>

      <div className="space-y-6">
        {/* Q1: Camera Model */}
        <div className="space-y-2">
          <label className="input-label" htmlFor="cameraModel">
            // Which camera do you use for Photography? Specify model *
          </label>
          <input
            id="cameraModel"
            type="text"
            placeholder="e.g., Canon EOS 200D Mark II, Sony a7III, or type 'None'..."
            {...register("cameraModel")}
            className="input-field"
          />
          {errors.cameraModel && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-destructive text-xs font-semibold">
              ⚠️ {errors.cameraModel.message}
            </motion.p>
          )}
        </div>

        {/* Q2: Phone Model */}
        <div className="space-y-2">
          <label className="input-label" htmlFor="phoneModel">
            // Which phone do you use for Photography? Specify model *
          </label>
          <input
            id="phoneModel"
            type="text"
            placeholder="e.g., iPhone 15 Pro, Samsung S23 Ultra, OnePlus 11..."
            {...register("phoneModel")}
            className="input-field"
          />
          {errors.phoneModel && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-destructive text-xs font-semibold">
              ⚠️ {errors.phoneModel.message}
            </motion.p>
          )}
        </div>

        {/* Q3: Experience Level */}
        <div className="space-y-2">
          <label className="input-label">
            // How would you describe your current level in photography? *
          </label>
          <div className="flex flex-col gap-3 p-3 bg-slate-900/40 rounded-xl border border-border/40">
            {[
              { value: "Beginner", label: "Beginner : New but interested" },
              { value: "Intermediate", label: "Intermediate : Practiced and clicked actively" },
              { value: "Advanced", label: "Advanced : Understands manual settings, composition and editing" }
            ].map((option) => (
              <label key={option.value} className="flex items-start gap-2.5 text-slate-300 text-xs sm:text-sm cursor-pointer select-none">
                <input
                  type="radio"
                  value={option.value}
                  {...register("experienceLevel")}
                  className="w-4 h-4 rounded-full border-slate-700 text-violet-500 bg-slate-900 focus:ring-violet-500/30 mt-0.5"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
          {errors.experienceLevel && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-destructive text-xs font-semibold">
              ⚠️ {errors.experienceLevel.message}
            </motion.p>
          )}
        </div>

        {/* Q4: Portfolio Link */}
        <div className="space-y-2">
          <label className="input-label" htmlFor="portfolioLink">
            // Share the drive link of some of your previous work *
          </label>
          <p className="text-[11px] text-muted-foreground mt-[-4px] leading-normal">
            Note: Upload your 20 best photos, also provide photography instagram page link inside the folder (if any). Ensure public view access.
          </p>
          <input
            id="portfolioLink"
            type="text"
            placeholder="Share the Google Drive link to your photos..."
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
