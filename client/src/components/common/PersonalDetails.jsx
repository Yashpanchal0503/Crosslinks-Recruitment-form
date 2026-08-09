import React from "react";
import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";

const PersonalDetails = () => {
  const { register, watch, formState: { errors } } = useFormContext();

  const Field = ({ label, name, type = "text", placeholder, children }) => (
    <div className="space-y-2">
      <label className="input-label" htmlFor={name}>
        // {label}
      </label>
      {children || (
        <input id={name} type={type} {...register(name)} className="input-field" placeholder={placeholder} />
      )}
      {errors[name] && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-destructive text-xs mt-1.5 font-semibold">
          ⚠️ {errors[name].message}
        </motion.p>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="rounded-2xl glass-card p-6 sm:p-8"
    >
      <div className="mb-8 border-b border-border/60 pb-5">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight font-sans">Personal Information</h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">Please fill in your basic contact and academic details.</p>
      </div>
      <div className="space-y-6">
        {/* Row 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Full Name" name="fullName" placeholder="Suresh" />
          <Field label="Email" name="email" type="email" placeholder="suresh@gmail.com" />
        </div>
        {/* Row 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
<<<<<<< HEAD
          <Field label="Roll Number" name="rollNumber" placeholder="2026UIN3341" />
=======
          <Field label="Roll Number" name="rollNumber" placeholder="2025UCD2117" />
>>>>>>> b30aa32 (Save current recruitment portal UI design system and layout)
          <Field label="Contact Number" name="contactNumber" placeholder="9876543210" />
        </div>
        {/* Row 3 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Campus" name="campus">
            <div className="grid grid-cols-3 gap-2.5 pt-1.5">
              {["Main", "East", "West"].map((c) => {
                const isChecked = watch("campus") === c;
                return (
                  <label
                    key={c}
                    className={`flex items-center justify-center py-2.5 px-3 rounded-xl border text-[11px] font-mono tracking-wider font-bold cursor-pointer select-none transition-all duration-300 ${
                      isChecked
                        ? "border-accent bg-accent/15 text-accent shadow-[0_0_12px_rgba(139,92,246,0.15)] scale-[1.02]"
                        : "border-border/80 bg-slate-900/40 text-slate-400 hover:border-accent/60 hover:text-white"
                    }`}
                  >
                    <input type="radio" value={c} {...register("campus")} className="sr-only" />
                    {c.toUpperCase()}
                  </label>
                );
              })}
            </div>
          </Field>
          <Field label="Branch & Year" name="branch" placeholder="CSE / CSAI / ECE / ..." />
        </div>
        {/* Textareas */}
        <Field label="About You" name="about">
          <textarea {...register("about")} className="input-field min-h-[110px] resize-y" placeholder="Tell us something about yourself. (A brief introduction about your hobbies and interests)..." />
        </Field>
        <Field label="Why Crosslinks?" name="whyJoin">
          <textarea {...register("whyJoin")} className="input-field min-h-[110px] resize-y" placeholder="Why do you want to join Crosslinks?" />
        </Field>
      </div>
    </motion.div>
  );
};

export default PersonalDetails;
