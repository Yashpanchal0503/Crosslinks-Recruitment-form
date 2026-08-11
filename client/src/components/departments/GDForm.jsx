import React from "react";
import { useFormContext } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Check, FolderPlus, ExternalLink, Download, AlertTriangle, Sparkles, Image as ImageIcon } from "lucide-react";

const GDForm = () => {
  const { register, watch, formState: { errors, touchedFields, isSubmitted } } = useFormContext();

  const softwaresUsed = watch("softwaresUsed") || [];
  const showOtherSoftwareInput = softwaresUsed.includes("Other");

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
        <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
          Please include a Google Drive link to your <u>previous work</u>, ideally original project files (e.g., PSD files) with all layers intact.
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
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-destructive text-xs sm:text-sm font-semibold">
              ⚠️ {errors.interestReason.message}
            </motion.p>
          )}
        </div>

        {/* Q2: Softwares Used */}
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
                  className={`flex items-center justify-between py-3 px-4 rounded-xl border text-xs sm:text-sm font-bold cursor-pointer select-none transition-all duration-300 ${isChecked
                      ? "border-accent bg-accent/15 text-accent shadow-[0_0_12px_rgba(139,92,246,0.15)] scale-[1.02]"
                      : "border-border/80 bg-muted/50 text-muted-foreground hover:border-accent/60 hover:text-foreground"
                    }`}
                >
                  <input
                    type="checkbox"
                    value={sw}
                    {...register("softwaresUsed")}
                    className="sr-only"
                  />
                  <span>{sw.toUpperCase()}</span>
                  {isChecked && (
                    <span className="w-4 h-4 rounded-full bg-accent text-white flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  )}
                </label>
              );
            })}
          </div>
          {shouldShowError("softwaresUsed") && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-destructive text-xs sm:text-sm font-semibold mt-1">
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
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-destructive text-xs sm:text-sm font-semibold">
                    ⚠️ {errors.otherSoftware.message}
                  </motion.p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Q3: Redesigned Google Drive Folder Link & Submission Section */}
        <div className="space-y-4 pt-2">
          <label className="input-label" htmlFor="driveLink">
            // Google Drive Folder Link containing all submissions *
          </label>

          {/* Guidelines Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-muted/60 border border-border/80 space-y-3">
            <div className="flex items-center gap-2 text-accent font-bold text-sm sm:text-base">
              <FolderPlus className="w-4.5 h-4.5" />
              <span>Drive Folder Submission Guidelines</span>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Create a single Google Drive folder containing:
            </p>

            <ul className="text-xs sm:text-sm text-foreground space-y-2 font-sans pl-1">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                <span><strong>Completed Design Task</strong> (Choose Task 1 or Task 2 below)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                <span><strong>Previous Design Portfolio / Works</strong> (If applicable)</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-accent/50 shrink-0" />
                <span><strong>Introductory Post Design</strong> (Optional brownie points)</span>
              </li>
            </ul>

            {/* Public Access Warning Pill */}
            <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs sm:text-sm font-semibold flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Ensure public view access permissions are enabled on your Google Drive link.</span>
            </div>
          </div>

          {/* Design Task Options (Grid Cards) */}
          <div className="space-y-2">
            <p className="text-xs font-mono font-semibold text-muted-foreground uppercase">// Choose Any 1 Design Task Below:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Task Option 1 */}
              <div className="p-4 rounded-xl bg-card border border-border/80 flex flex-col justify-between space-y-3 hover:border-accent/60 transition-colors">
                <div>
                  <span className="text-[11px] font-mono font-bold text-accent px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20">
                    TASK OPTION A
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-foreground mt-2">NSUTTHON After-Movie Cover</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">Dimension: 1080x1920 (Vertical Reel Cover)</p>
                </div>
                <a
                  href="https://www.instagram.com/p/DBwFd7YsAM_/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-accent hover:underline"
                >
                  View Reference Reel <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Task Option 2 */}
              <div className="p-4 rounded-xl bg-card border border-border/80 flex flex-col justify-between space-y-3 hover:border-accent/60 transition-colors">
                <div>
                  <span className="text-[11px] font-mono font-bold text-accent px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20">
                    TASK OPTION B
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-foreground mt-2">Redesign NSUT Yearbook 2026</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">Front & Back Cover Page Redesign</p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-muted-foreground">
                  <ImageIcon className="w-3.5 h-3.5 text-accent" /> Sample Preview Below
                </span>
              </div>
            </div>
          </div>

          {/* Optional Extra Task Badge */}
          <div className="p-3.5 rounded-xl bg-card border border-border/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-accent shrink-0" />
              <span className="text-xs sm:text-sm text-foreground font-semibold">
                [Optional] Extra Task: Design an introductory post introducing yourself for Crosslinks page
              </span>
            </div>
            <span className="text-[11px] font-mono font-bold text-emerald-500 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 shrink-0">
              + BROWNIE POINTS
            </span>
          </div>

          {/* Quick Resource Download Action Bar */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1">
            <a
              href="https://drive.google.com/file/d/139KNSDVUtT9jp96UVxjLfvk5udS5_oTZ/view?usp=sharing"
              target="_blank"
              rel="noreferrer"
              className="h-9 px-3.5 inline-flex items-center gap-2 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs sm:text-sm font-semibold hover:bg-accent hover:text-white transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Download Crosslinks Logo
            </a>
            <a
              href="https://www.instagram.com/crosslinks.nsut/"
              target="_blank"
              rel="noreferrer"
              className="h-9 px-3.5 inline-flex items-center gap-2 rounded-full border border-border bg-card text-foreground hover:bg-muted text-xs sm:text-sm font-semibold transition-all cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 text-accent fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              @crosslinks.nsut
            </a>
          </div>

          {/* Yearbook 2026 Sample Preview Card */}
          <div className="my-3 p-3 bg-muted/50 rounded-2xl border border-border/60 max-w-md mx-auto">
            <p className="text-[11px] font-mono text-muted-foreground mb-2 text-center tracking-wider">// YEARBOOK 2026 SAMPLE REFERENCE</p>
            <img
              src="/yearbook_sample.png"
              alt="Yearbook 2026 Sample"
              className="w-full h-auto rounded-xl border border-border/40 shadow-lg"
            />
          </div>

          {/* Main Input Field */}
          <input
            id="driveLink"
            type="text"
            placeholder="Share your combined Google Drive folder link here (starting with http:// or https://)..."
            {...register("driveLink")}
            className="input-field"
          />
          {shouldShowError("driveLink") && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-destructive text-xs sm:text-sm font-semibold">
              ⚠️ {errors.driveLink.message}
            </motion.p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default GDForm;
