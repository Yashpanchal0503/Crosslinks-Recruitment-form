import React from "react";
import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";

const PersonalDetails = () => {
  const { register, formState: { errors } } = useFormContext();

  const Field = ({ label, name, type = "text", placeholder, children }) => (
    <div className="space-y-2">
      <label className="input-label" htmlFor={name}>
        // {label}
      </label>
      {children || (
        <input id={name} type={type} {...register(name)} className="input-field" placeholder={placeholder} />
      )}
      {errors[name] && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-destructive text-xs mt-1.5 font-medium">
          {errors[name].message}
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
          <Field label="Full Name" name="fullName" placeholder="John Doe" />
          <Field label="Email" name="email" type="email" placeholder="john@nsut.ac.in" />
        </div>
        {/* Row 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Roll Number" name="rollNumber" placeholder="2024UGCS001" />
          <Field label="Contact Number" name="contactNumber" placeholder="9876543210" />
        </div>
        {/* Row 3 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Campus" name="campus">
            <div className="flex items-center gap-6 pt-2">
              {["Main", "East", "West"].map(c => (
                <label key={c} className="flex items-center gap-2.5 cursor-pointer group">
                  <div className="relative">
                    <input type="radio" value={c} {...register("campus")} className="peer sr-only" />
                    <div className="w-4 h-4 rounded-full border-2 border-border peer-checked:border-accent peer-checked:bg-accent/20 transition-all" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                    </div>
                  </div>
                  <span className="text-xs sm:text-sm text-muted-foreground group-hover:text-foreground transition-colors font-medium">{c} Campus</span>
                </label>
              ))}
            </div>
          </Field>
          <Field label="Branch & Year" name="branch" placeholder="CSE / CSAI / ECE - 1st Year..." />
        </div>
        {/* Textareas */}
        <Field label="About You" name="about">
          <textarea {...register("about")} className="input-field min-h-[110px] resize-y" placeholder="Tell us about your hobbies, interests, and what makes you unique..." />
        </Field>
        <Field label="Why Crosslinks?" name="whyJoin">
          <textarea {...register("whyJoin")} className="input-field min-h-[110px] resize-y" placeholder="What excites you about joining Crosslinks Society?" />
        </Field>
      </div>
    </motion.div>
  );
};

export default PersonalDetails;
