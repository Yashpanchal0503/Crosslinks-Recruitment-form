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
          Share your writing, imagination, and links to previous work. (Word limit: 200 per answer)
        </p>
      </div>

      <div className="space-y-6">
        {/* Q1: Controversial Opinion */}
        <div className="space-y-2">
          <label className="input-label" htmlFor="controversialOpinion">
            // What is a controversial but harmless opinion you hold and how would you defend it in a heated argument? *
          </label>
          <textarea
            id="controversialOpinion"
            rows={4}
            placeholder="Share your opinion and defend it..."
            {...register("controversialOpinion")}
            className="input-field min-h-[110px] resize-y"
          />
          {errors.controversialOpinion && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-destructive text-xs font-semibold">
              ⚠️ {errors.controversialOpinion.message}
            </motion.p>
          )}
        </div>

        {/* Q2: Desk Item Backstory */}
        <div className="space-y-2">
          <label className="input-label" htmlFor="deskItemStory">
            // Write a short interesting and dramatic backstory of the most boring item kept on your desk right now *
          </label>
          <textarea
            id="deskItemStory"
            rows={4}
            placeholder="Write a dramatic story about a pencil, eraser, bottle, or piece of paper..."
            {...register("deskItemStory")}
            className="input-field min-h-[110px] resize-y"
          />
          {errors.deskItemStory && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-destructive text-xs font-semibold">
              ⚠️ {errors.deskItemStory.message}
            </motion.p>
          )}
        </div>

        {/* Q3: Portfolio Link */}
        <div className="space-y-2">
          <label className="input-label" htmlFor="portfolioLink">
            // Share the drive link to some of your previous works here *
          </label>
          <p className="text-[11px] text-muted-foreground mt-[-4px]">
            Ensure that the drive link has public view permissions.
          </p>
          <input
            id="portfolioLink"
            type="text"
            placeholder="Share the Google Drive link to your articles or documents..."
            {...register("portfolioLink")}
            className="input-field"
          />
          {errors.portfolioLink && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-destructive text-xs font-semibold">
              ⚠️ {errors.portfolioLink.message}
            </motion.p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ContentForm;
