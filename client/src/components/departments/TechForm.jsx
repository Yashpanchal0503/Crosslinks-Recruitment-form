import React from "react";
import { useFormContext } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

const TechForm = () => {
  const {
    register,
    watch,
    formState: { errors, touchedFields, isSubmitted },
  } = useFormContext();

  const techDomains = watch("techDomains") || [];
  const isWebDevSelected = techDomains.includes("Web Development");
  const selectedWebDevType = watch("webDevType");
  const hasWebDevTypeSelected = !!selectedWebDevType;

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
          💻 Tech Department Questions
        </h3>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Tell us about your technical skillset, domain focus, and share your work.
        </p>
      </div>

      <div className="space-y-6">
        {/* Q1: Motivation */}
        <div className="space-y-2">
          <label className="input-label" htmlFor="motivation">
            // What motivates you to join the Tech Department at Crosslinks? *
          </label>
          <textarea
            id="motivation"
            rows={4}
            placeholder="Tell us what drives you to join the tech team..."
            {...register("motivation")}
            className="input-field min-h-[110px] resize-y"
          />
          {shouldShowError("motivation") && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-destructive text-sm font-semibold"
            >
              ⚠️ {errors.motivation.message}
            </motion.p>
          )}
        </div>

        {/* Q2: Domains (Square Checkboxes) */}
        <div className="space-y-2">
          <label className="input-label">
            // Which technical domains are you skilled in? *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {[
              { id: "Web Development", title: "Web Development", subtitle: "Websites & Web Apps" },
              { id: "App Development", title: "App Development", subtitle: "iOS / Android / Flutter" },
            ].map((domain) => {
              const isChecked = techDomains.includes(domain.id);
              return (
                <label
                  key={domain.id}
                  className={`flex items-start justify-between p-4 rounded-xl border cursor-pointer select-none transition-all duration-300 ${
                    isChecked
                      ? "border-accent bg-accent/15 text-accent shadow-[0_0_12px_rgba(45,160,73,0.15)]"
                      : "border-border/80 bg-muted/50 text-muted-foreground hover:border-accent/60 hover:text-foreground"
                  }`}
                >
                  <input
                    type="checkbox"
                    value={domain.id}
                    {...register("techDomains")}
                    className="sr-only"
                  />
                  <div>
                    <span className={`text-sm sm:text-base font-bold font-sans block ${isChecked ? "text-accent" : "text-foreground"}`}>
                      {domain.title}
                    </span>
                    <span className="text-xs sm:text-sm text-muted-foreground mt-0.5 block leading-tight">
                      {domain.subtitle}
                    </span>
                  </div>
                  {/* Square Checkbox Indicator */}
                  <div
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 ml-2 transition-all duration-300 ${
                      isChecked
                        ? "border-accent bg-accent text-white shadow-sm"
                        : "border-border/80 bg-card group-hover:border-accent/60"
                    }`}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </label>
              );
            })}
          </div>
          {shouldShowError("techDomains") && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-destructive text-sm font-semibold"
            >
              ⚠️ {errors.techDomains.message}
            </motion.p>
          )}
        </div>

        {/* Q2 Sub-option: Web Dev Specialization (Radio Circles) */}
        <AnimatePresence>
          {isWebDevSelected && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="space-y-2 pt-2"
            >
              <label className="input-label">
                // Specify your Web Development scope: *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {[
                  { value: "Front-end Only", label: "Front-end Only", desc: "UI, React, Styling" },
                  { value: "Full-stack", label: "Full-stack", desc: "Front-end + Backend & Databases" },
                ].map((option) => {
                  const isChecked = selectedWebDevType === option.value;
                  return (
                    <label
                      key={option.value}
                      className={`flex items-start justify-between p-4 rounded-xl border cursor-pointer select-none transition-all duration-300 ${
                        isChecked
                          ? "border-accent bg-accent/15 text-accent shadow-sm scale-[1.01] opacity-100"
                          : hasWebDevTypeSelected
                          ? "border-border/60 bg-card/60 opacity-45 hover:opacity-90 hover:scale-[1.01]"
                          : "border-border/80 bg-muted/40 text-muted-foreground hover:border-accent/60 hover:text-foreground"
                      }`}
                    >
                      <input
                        type="radio"
                        value={option.value}
                        {...register("webDevType")}
                        className="sr-only"
                      />
                      <div>
                        <span className={`text-sm sm:text-base font-bold font-sans block ${isChecked ? "text-accent" : "text-foreground"}`}>
                          {option.label}
                        </span>
                        <span className="text-xs sm:text-sm text-muted-foreground mt-0.5 block leading-tight">
                          {option.desc}
                        </span>
                      </div>
                      {/* Radio Circle Indicator */}
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ml-2 transition-all duration-300 ${
                          isChecked
                            ? "border-accent bg-accent text-white shadow-sm"
                            : "border-border/80 bg-card"
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </label>
                  );
                })}
              </div>
              {shouldShowError("webDevType") && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-destructive text-sm font-semibold"
                >
                  ⚠️ {errors.webDevType.message}
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Q3: Languages & Frameworks */}
        <div className="space-y-2">
          <label className="input-label" htmlFor="skills">
            // Which frameworks and languages are you proficient in? *
          </label>
          <textarea
            id="skills"
            rows={3}
            placeholder="e.g. HTML, CSS, JavaScript, React, Next.js, Node.js, Python, Flutter, Swift, Django, MongoDB etc."
            {...register("skills")}
            className="input-field min-h-[90px] resize-y"
          />
          {shouldShowError("skills") && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-destructive text-sm font-semibold"
            >
              ⚠️ {errors.skills.message}
            </motion.p>
          )}
        </div>

        {/* Q4: Portfolio / Live Links / Drive Link */}
        <div className="space-y-2">
          <label className="input-label" htmlFor="portfolioLink">
            // Share your portfolio or any <u>previous work</u> *
          </label>
          <div className="text-xs sm:text-sm text-muted-foreground bg-muted/60 p-3.5 sm:p-4 rounded-xl border border-border/60 leading-relaxed">
            💡 <strong>Share Option:</strong> You can share the link to your website/app directly, or share a GitHub repository / Google Drive folder link. (Ensure public view permissions if sharing Google Drive).
          </div>
          <input
            id="portfolioLink"
            type="text"
            placeholder="e.g., https://mywebsite.com, https://github.com/username/project, or Google Drive link..."
            {...register("portfolioLink")}
            className="input-field"
          />
          {shouldShowError("portfolioLink") && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-destructive text-sm font-semibold"
            >
              ⚠️ {errors.portfolioLink.message}
            </motion.p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TechForm;
