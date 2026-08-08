import React from "react";
import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";

const TechForm = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl glass-card p-6 sm:p-8"
    >
      <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4">
        Tech Department Questions
      </h3>
      <div className="space-y-6">
        {/* Programming Languages */}
        <div className="space-y-2">
          <label className="input-label" htmlFor="programmingLanguages">
            Preferred Programming Languages
          </label>
          <input
            id="programmingLanguages"
            type="text"
            placeholder="e.g., JavaScript, Python, C++"
            {...register("programmingLanguages")}
            className="input-field"
          />
          {errors.programmingLanguages && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-xs"
            >
              {errors.programmingLanguages.message}
            </motion.p>
          )}
        </div>
        {/* Frameworks */}
        <div className="space-y-2">
          <label className="input-label" htmlFor="frameworks">
            Frameworks / Libraries (optional)
          </label>
          <input
            id="frameworks"
            type="text"
            placeholder="React, Express, Django, etc."
            {...register("frameworks")}
            className="input-field"
          />
          {errors.frameworks && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-xs"
            >
              {errors.frameworks.message}
            </motion.p>
          )}
        </div>
        {/* Projects */}
        <div className="space-y-2">
          <label className="input-label" htmlFor="projects">
            Notable Projects (optional)
          </label>
          <textarea
            id="projects"
            rows={4}
            placeholder="Briefly describe your most important projects"
            {...register("projects")}
            className="input-field"
          />
          {errors.projects && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-xs"
            >
              {errors.projects.message}
            </motion.p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TechForm;
