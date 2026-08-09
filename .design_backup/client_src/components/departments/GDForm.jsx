import React from "react";
import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";

const GDForm = () => {
  const { register, formState: { errors, touchedFields, isSubmitted } } = useFormContext();

  // Helper to determine if we should show the validation error for a field
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
          🎨 Graphic Design Department Questions
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1 text-justify leading-relaxed">
          Please include a Google Drive link to your <u>previous work</u>, ideally the original project files with all layers and assets intact (for example, a PSD file). This helps us confirm the work is yours.<br />
          Not submitting project files won't count against you. However, if we find any plagiarism or AI-generated work passed off as your own, your application and any future applications to Crosslinks will be voided. Project files help us verify authenticity and assess your actual skill level.
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
          {shouldShowError("interestReason") && (
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
          {shouldShowError("softwaresUsed") && (
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
          
          <div className="text-[11px] text-slate-300 bg-slate-950/40 p-3.5 rounded-xl border border-border/40 leading-relaxed space-y-2">
            <p>
              <strong>Task:</strong> Do <u>any one</u> of the following design tasks: <br />
              1. <strong>NSUTTHON After-movie cover page</strong> <br />
              2. <strong>Redesign NSUT Yearbook 2026 Front & Back Page</strong>
            </p>
            <p>
              🔗 <strong>Logo file link:</strong> <a href="https://drive.google.com/file/d/139KNSDVUtT9jp96UVxjLfvk5udS5_oTZ/view?usp=sharing" target="_blank" rel="noreferrer" className="text-violet-400 hover:underline">Download Crosslinks Logo</a><br />
              Dimension requirement: 1080x1920.<br />
              Check out our Instagram handle for a better understanding: <a href="https://www.instagram.com/crosslinks.nsut/" target="_blank" rel="noreferrer" className="text-violet-400 hover:underline">@crosslinks.nsut</a>
            </p>
            <p>
              Reel reference for NSUTTHON cover: <a href="https://www.instagram.com/p/DBwFd7YsAM_/" target="_blank" rel="noreferrer" className="text-violet-400 hover:underline">View Reel</a>
            </p>
          </div>

          {/* Yearbook 2026 Sample Image directly in form */}
          <div className="my-4 p-2.5 bg-slate-900/60 rounded-xl border border-border/50 max-w-md mx-auto">
            <p className="text-[10px] font-mono text-slate-400 mb-1.5 text-center tracking-wider">// YEARBOOK 2026 SAMPLE REFERENCE</p>
            <img 
              src="/yearbook_sample.png" 
              alt="Yearbook 2026 Sample" 
              className="w-full h-auto rounded-lg border border-border/20 shadow-md"
            />
          </div>

          <input
            id="taskLink"
            type="text"
            placeholder="Share the Google Drive link to your design task here..."
            {...register("taskLink")}
            className="input-field"
          />
          {shouldShowError("taskLink") && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-destructive text-xs font-semibold">
              ⚠️ {errors.taskLink.message}
            </motion.p>
          )}
        </div>

        {/* Q4: Brownie Link */}
        <div className="space-y-2">
          <label className="input-label" htmlFor="brownieLink">
            // If you want to earn some extra points (aka brownie points) during recruitment: Suppose you get selected for crosslinks, Design an introductory post, introducing yourself on the crosslinks page (Optional)
          </label>
          <p className="text-[11px] text-muted-foreground mt-[-4px] leading-normal">
            You can add your submission link right here:
          </p>
          <input
            id="brownieLink"
            type="text"
            placeholder="Share the Google Drive link to your introductory design..."
            {...register("brownieLink")}
            className="input-field"
          />
          {shouldShowError("brownieLink") && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-destructive text-xs font-semibold">
              ⚠️ {errors.brownieLink.message}
            </motion.p>
          )}
        </div>

        {/* Q5: Previous Work Link */}
        <div className="space-y-2">
          <label className="input-label" htmlFor="previousWorkLink">
            // Attach a drive link of your <u>previous work</u> if any, else type N/A *
          </label>
          <p className="text-[11px] text-muted-foreground mt-[-4px]">
            (<u>Give Public permission access to the drive folder</u>)
          </p>
          <input
            id="previousWorkLink"
            type="text"
            placeholder="Google Drive link to previous work or type 'N/A'..."
            {...register("previousWorkLink")}
            className="input-field"
          />
          {errors.previousWorkLink && shouldShowError("previousWorkLink") && (
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
