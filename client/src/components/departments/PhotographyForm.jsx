import React from "react";
import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";

const PhotographyForm = () => {
  const { register, watch, formState: { errors, touchedFields, isSubmitted } } = useFormContext();

  const shouldShowError = (fieldName) => {
    return errors[fieldName] && (touchedFields[fieldName] || isSubmitted);
  };

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
          {shouldShowError("cameraModel") && (
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
          {shouldShowError("phoneModel") && (
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
          <div className="flex flex-col gap-3">
            {[
              { value: "Beginner", title: "Beginner", desc: "New but interested" },
              { value: "Intermediate", title: "Intermediate", desc: "Practiced and clicked actively" },
              { value: "Advanced", title: "Advanced", desc: "Understands manual settings, composition and editing" }
            ].map((option) => {
              const isChecked = watch("experienceLevel") === option.value;
              return (
                <label
                  key={option.value}
                  className={`flex flex-col p-4 rounded-xl border cursor-pointer select-none transition-all duration-300 ${
                    isChecked
                      ? "border-accent bg-accent/15 text-accent shadow-[0_0_12px_rgba(139,92,246,0.15)] scale-[1.01]"
                      : "border-border/80 bg-slate-900/40 text-slate-300 hover:border-accent/60 hover:text-white"
                  }`}
                >
                  <input
                    type="radio"
                    value={option.value}
                    {...register("experienceLevel")}
                    className="sr-only"
                  />
                  <span className={`text-sm font-bold font-sans ${isChecked ? "text-accent" : "text-foreground"}`}>
                    {option.title}
                  </span>
                  <span className="text-xs text-muted-foreground mt-1 leading-normal">
                    {option.desc}
                  </span>
                </label>
              );
            })}
          </div>
          {shouldShowError("experienceLevel") && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-destructive text-xs font-semibold">
              ⚠️ {errors.experienceLevel.message}
            </motion.p>
          )}
        </div>

        {/* Q4: Portfolio Link */}
        <div className="space-y-2">
          <label className="input-label" htmlFor="portfolioLink">
            // Share the drive link of some of your <u>previous work</u> *
          </label>
          <p className="text-[11px] text-muted-foreground mt-[-4px] leading-normal">
            (<u>please provide view access</u>)<br />
            Note: Upload your 20 best photos, also provide photography instagram page, if any.
          </p>
          <input
            id="portfolioLink"
            type="text"
            placeholder="Share the Google Drive link to your photos..."
            {...register("portfolioLink")}
            className="input-field"
          />
          {shouldShowError("portfolioLink") && (
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
