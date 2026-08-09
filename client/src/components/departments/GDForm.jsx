import React from "react";
import { useFormContext } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";

const GDForm = () => {
  const { register, watch, formState: { errors, touchedFields, isSubmitted } } = useFormContext();

  const softwaresUsed = watch("softwaresUsed") || [];
  const showOtherSoftwareInput = softwaresUsed.includes("Other");

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

        {/* Q2: Softwares Used (Custom Selectable Checkbox Cards) */}
        <div className="space-y-2">
          <label className="input-label">
            // Which softwares have you previously used? *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {["Photoshop", "Figma", "Canva", "Illustrator", "Other"].map((sw) => {
              const isChecked = softwaresUsed.includes(sw);
              return (
                <label
                  key={sw}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-xs sm:text-sm font-bold cursor-pointer select-none transition-all duration-300 ${
                    isChecked
                      ? "border-accent bg-accent/15 text-accent shadow-[0_0_12px_rgba(139,92,246,0.15)] scale-[1.02]"
                      : "border-border/80 bg-slate-900/40 text-slate-400 hover:border-accent/60 hover:text-white"
                  }`}
                >
                  <input
                    type="checkbox"
                    value={sw}
                    {...register("softwaresUsed")}
                    className="sr-only"
                  />
                  <span>{sw.toUpperCase()}</span>
                </label>
              );
            })}
          </div>
          {shouldShowError("softwaresUsed") && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-destructive text-xs font-semibold mt-1">
              ⚠️ {errors.softwaresUsed.message}
            </motion.p>
          )}

          {/* Conditional Input for Other Software */}
          <AnimatePresence>
            {showOtherSoftwareInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 pt-2 overflow-hidden"
              >
                <label className="input-label" htmlFor="otherSoftware">
                  // Specify other software model/name *
                </label>
                <input
                  id="otherSoftware"
                  type="text"
                  placeholder="e.g. InDesign, CorelDraw, Blender..."
                  {...register("otherSoftware")}
                  className="input-field"
                />
                {shouldShowError("otherSoftware") && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-destructive text-xs font-semibold">
                    ⚠️ {errors.otherSoftware.message}
                  </motion.p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Q3: Combined GDrive Link */}
        <div className="space-y-2">
          <label className="input-label" htmlFor="driveLink">
            // Google Drive folder link containing all submissions *
          </label>
          
          <div className="text-[11px] text-slate-300 bg-slate-950/40 p-4 rounded-xl border border-border/40 leading-relaxed space-y-3">
            <p className="font-semibold text-xs text-accent">
              💡 INSTRUCTION: Please make a single Google Drive folder containing:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-300">
              <li>Your completed design task submission (Task details below).</li>
              <li>Your introductory post design (Optional, for brownie points).</li>
              <li>Your previous works / design portfolio.</li>
            </ul>
            <p className="text-amber-400 font-semibold mt-1">
              ⚠️ Make sure to <u>Give Public permission access to the drive folder</u> so we can view your work!
            </p>
          </div>

          <div className="text-[11px] text-slate-400 bg-slate-900/30 p-3.5 rounded-xl border border-border/20 leading-relaxed space-y-2">
            <p>
              <strong className="text-white">Task Details:</strong> Do <u>any one</u> of the following tasks: <br />
              1. <strong>NSUTTHON After-movie cover page</strong> (Dimension: 1080x1920, reference: <a href="https://www.instagram.com/p/DBwFd7YsAM_/" target="_blank" rel="noreferrer" className="text-violet-400 hover:underline">View Reel</a>) <br />
              2. <strong>Redesign NSUT Yearbook 2026 Front & Back Page</strong> (Reference image shown below) <br /> <br />

              <strong className="text-white">Extra Task (Brownie points):</strong> <br />
              Suppose you get selected for crosslinks, Design an introductory post, introducing yourself on the crosslinks page.
              <br /> <br />
              <strong className="text-white">Previous Work:</strong> <br />
              If applicable, add the Google Drive link; otherwise, type N/A.
            </p>
            <p>
              🔗 <strong>Logo file link:</strong> <a href="https://drive.google.com/file/d/139KNSDVUtT9jp96UVxjLfvk5udS5_oTZ/view?usp=sharing" target="_blank" rel="noreferrer" className="text-violet-400 hover:underline">Download Crosslinks Logo</a><br />
              Check out our Instagram handle for reference: <a href="https://www.instagram.com/crosslinks.nsut/" target="_blank" rel="noreferrer" className="text-violet-400 hover:underline">@crosslinks.nsut</a>
            </p>
          </div>

          {/* Yearbook 2026 Sample Image */}
          <div className="my-4 p-2.5 bg-slate-900/60 rounded-xl border border-border/50 max-w-md mx-auto">
            <p className="text-[10px] font-mono text-slate-400 mb-1.5 text-center tracking-wider">// YEARBOOK 2026 SAMPLE REFERENCE</p>
            <img 
              src="/yearbook_sample.png" 
              alt="Yearbook 2026 Sample" 
              className="w-full h-auto rounded-lg border border-border/20 shadow-md"
            />
          </div>

          <input
            id="driveLink"
            type="text"
            placeholder="Share your combined Google Drive folder link here (starting with http:// or https://)..."
            {...register("driveLink")}
            className="input-field"
          />
          {shouldShowError("driveLink") && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-destructive text-xs font-semibold">
              ⚠️ {errors.driveLink.message}
            </motion.p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default GDForm;
