import React from "react";
import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";

const ContentForm = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl glass-card p-6 sm:p-8"
    >
      <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4">
        Content Department Questions
      </h3>
      <div className="space-y-6">
        {/* Writing Samples */}
        <div className="space-y-2">
          <label className="input-label" htmlFor="writingSamples">
            Writing Sample URL (optional)
          </label>
          <input
            id="writingSamples"
            type="url"
            placeholder="https://your-sample.com"
            {...register("writingSamples")}
            className="input-field"
          />
          {errors.writingSamples && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs">
              {errors.writingSamples.message}
            </motion.p>
          )}
        </div>
        {/* Topics of Interest */}
        <div className="space-y-2">
          <label className="input-label" htmlFor="topicsOfInterest">
            Topics of Interest
          </label>
          <input
            id="topicsOfInterest"
            type="text"
            placeholder="Tech, Culture, Education..."
            {...register("topicsOfInterest")}
            className="input-field"
          />
          {errors.topicsOfInterest && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs">
              {errors.topicsOfInterest.message}
            </motion.p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ContentForm;
