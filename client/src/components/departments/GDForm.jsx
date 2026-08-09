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
          Complete the design tasks and share your project files and interest.
        </p>
      </div>

      <div className="space-y-6">
        {/* Q1: Interest */}
        <div className="space-y-2">
          <label className="input-label" htmlFor="interestReason">
            // Why are you interested in joining the Graphic Design department at Crosslinks? *
          </label>
          <textarea
            id="interestReason"
            rows={4}
            placeholder="Tell us what excites you about designing for Crosslinks..."
            {...register("interestReason")}
            className="input-field min-h-[110px] resize-y"
          />
          {errors.interestReason && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-destructive text-xs font-semibold">
              ⚠️ {errors.interestReason.message}
            </motion.p>
          )}
        </div>

        {/* Q2: Softwares Used */}
        <div className="space-y-2">
          <label className="input-label">
            // Which softwares have you previously used? *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-slate-900/40 rounded-xl border border-border/40">
            {["Photoshop", "Figma", "Canva", "Illustrator", "Other"].map((sw) => (
              <label key={sw} className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  value={sw}
                  {...register("softwaresUsed")}
                  className="w-4 h-4 rounded border-slate-700 text-violet-500 bg-slate-900 focus:ring-violet-500/30"
                />
                {sw}
              </label>
            ))}
          </div>
          {errors.softwaresUsed && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-destructive text-xs font-semibold">
              ⚠️ {errors.softwaresUsed.message}
            </motion.p>
          )}
        </div>

        {/* Q3: Task Link */}
        <div className="space-y-2">
          <label className="input-label" htmlFor="taskLink">
            // Add your post design link here *
          </label>
          <p className="text-[11px] text-muted-foreground mt-[-4px] leading-normal">
            <strong>Task:</strong> Do any one of the following design tasks: NSUTTHON After-movie cover page OR Redesign NSUT Yearbook 2026 Front & Back Page. <br />
            Logo file: <a href="https://drive.google.com/file/d/139KNSDVUtT9jp96UVxjLfvk5udS5_oTZ/view?usp=sharing" target="_blank" rel="noreferrer" className="text-violet-400 hover:underline">Download Logo</a>. Dimension: 1080x1920.
          </p>
          <input
            id="taskLink"
            type="text"
            placeholder="Share the Google Drive link to your design task here..."
            {...register("taskLink")}
            className="input-field"
          />
          {errors.taskLink && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-destructive text-xs font-semibold">
              ⚠️ {errors.taskLink.message}
            </motion.p>
          )}
        </div>

        {/* Q4: Brownie Link */}
        <div className="space-y-2">
          <label className="input-label" htmlFor="brownieLink">
            // Add your brownie points submission link here (Optional)
          </label>
          <p className="text-[11px] text-muted-foreground mt-[-4px] leading-normal">
            <strong>Brownie Points Task:</strong> Design an introductory post, introducing yourself on the crosslinks page.
          </p>
          <input
            id="brownieLink"
            type="text"
            placeholder="Share the Google Drive link to your introductory design..."
            {...register("brownieLink")}
            className="input-field"
          />
          {errors.brownieLink && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-destructive text-xs font-semibold">
              ⚠️ {errors.brownieLink.message}
            </motion.p>
          )}
        </div>

        {/* Q5: Previous Work Link */}
        <div className="space-y-2">
          <label className="input-label" htmlFor="previousWorkLink">
            // Attach a drive link of your previous work if any, else type N/A *
          </label>
          <input
            id="previousWorkLink"
            type="text"
            placeholder="Google Drive link to previous work or type 'N/A'..."
            {...register("previousWorkLink")}
            className="input-field"
          />
          {errors.previousWorkLink && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-destructive text-xs font-semibold">
              ⚠️ {errors.previousWorkLink.message}
            </motion.p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default GDForm;
