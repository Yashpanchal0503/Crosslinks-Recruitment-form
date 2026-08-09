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
      <div className="mb-6 border-b border-border/60 pb-4">
        <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight font-sans">
          ✍️ Content Department Questions
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Share your writing experience, topics of interest, and sample links.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="input-label" htmlFor="topicsOfInterest">
            // Topics of Interest
          </label>
          <input
            id="topicsOfInterest"
            type="text"
            placeholder="e.g., Festival Coverage, Tech Trends, Pop Culture, Copywriting"
            {...register("topicsOfInterest")}
            className="input-field"
          />
          {errors.topicsOfInterest && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-destructive text-xs font-semibold">
              ⚠️ {errors.topicsOfInterest.message}
            </motion.p>
          )}
        </div>

        <div className="space-y-2">
          <label className="input-label" htmlFor="writingSamples">
            // Writing Samples / Article URL (Optional)
          </label>
          <input
            id="writingSamples"
            type="url"
            placeholder="https://medium.com/your-article or Drive link..."
            {...register("writingSamples")}
            className="input-field"
          />
          {errors.writingSamples && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-destructive text-xs font-semibold">
              ⚠️ {errors.writingSamples.message}
            </motion.p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ContentForm;
