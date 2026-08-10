import React from "react";
import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";
import { Cpu, Palette, Camera, Edit3, Video, Check, Info } from "lucide-react";

const departments = [
  {
    key: "Photography",
    name: "Photography",
    icon: <Camera className="w-6 h-6" />,
    description: "Capture campus events, edit high-resolution photos, and direct video shoots.",
  },
  {
    key: "Graphic Design",
    name: "Graphic Design",
    icon: <Palette className="w-6 h-6" />,
    description: "Create poster art, social media carousels, UI components, and brand identities.",
  },
  {
    key: "Video Editing",
    name: "Video Editing",
    icon: <Video className="w-6 h-6" />,
    description: "Craft cinematic fest trailers, motion graphics, and engaging social reels.",
  },
  {
    key: "Tech",
    name: "Tech",
    icon: <Cpu className="w-6 h-6" />,
    description: "Build web applications, internal recruitment portals, and high-performance APIs.",
  },
  {
    key: "Content",
    name: "Content",
    icon: <Edit3 className="w-6 h-6" />,
    description: "Write captions, festival coverage, official press releases, and creative scripts.",
  },
];

const DepartmentSelector = () => {
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  const selected = watch("department");
  const hasSelected = !!selected;

  const handleSelect = (deptKey) => {
    setValue("department", deptKey, { shouldValidate: true });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl glass-card p-6 sm:p-8 relative overflow-hidden"
    >
      <div className="mb-6 border-b border-border/60 pb-4">
        <div className="flex items-end justify-between gap-4 mb-2">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight font-sans">
              Select Your Department
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Choose the primary domain you wish to apply for in Crosslinks.
            </p>
          </div>
          <span className="hidden sm:inline-block text-xs font-mono text-accent font-semibold px-3 py-1 rounded-full bg-accent/10 border border-accent/20 shrink-0">
            // 5 DOMAINS AVAILABLE
          </span>
        </div>

        {/* Multiple Departments Application Notice Box */}
        <div className="mt-3 p-3 rounded-xl bg-accent/10 border border-accent/20 text-foreground text-xs leading-relaxed flex items-start gap-2.5">
          <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
          <p>
            <strong className="text-accent">Separate Application Notice:</strong> You can only select <u className="font-semibold">one department per application</u>. If you wish to apply for multiple departments, please submit a separate application form for each department.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {departments.map((dept) => {
          const isSelected = selected === dept.key;
          return (
            <motion.button
              key={dept.key}
              type="button"
              onClick={() => handleSelect(dept.key)}
              className={`group relative flex flex-col justify-between p-6 rounded-2xl text-left transition-all duration-300 cursor-pointer overflow-hidden ${
                isSelected
                  ? "border-2 border-accent bg-gradient-to-br from-accent/20 via-accent/5 to-card shadow-xl shadow-accent/20 ring-1 ring-accent/30 scale-[1.02] opacity-100 z-10"
                  : hasSelected
                  ? "border border-border/60 bg-card/60 opacity-45 hover:opacity-90 hover:scale-[1.01] hover:border-accent/60"
                  : "border border-border/80 bg-card hover:bg-muted/50 hover:border-accent/60 shadow-md hover:shadow-xl hover:shadow-accent/10"
              }`}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Subtle Card Glow Effect */}
              {isSelected && (
                <div className="pointer-events-none absolute -top-12 -right-12 w-28 h-28 bg-accent/20 rounded-full blur-2xl" />
              )}

              <div>
                {/* Header Row: Icon & Single Select Radio Indicator */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      isSelected
                        ? "bg-accent text-white shadow-lg shadow-accent/30 scale-105"
                        : "bg-accent/10 text-accent border border-accent/20 group-hover:bg-accent group-hover:text-white group-hover:scale-105 shadow-[0_0_15px_oklch(var(--accent)/0.12)]"
                    }`}
                  >
                    {dept.icon}
                  </div>

                  {/* Single Select Radio Circle Badge */}
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      isSelected
                        ? "border-accent bg-accent text-white shadow-md shadow-accent/30 scale-110"
                        : "border-border/80 bg-card group-hover:border-accent/70"
                    }`}
                  >
                    {isSelected ? (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-transparent group-hover:bg-accent/40 transition-colors" />
                    )}
                  </div>
                </div>

                {/* Title & Description */}
                <h4 className={`text-base sm:text-lg font-bold tracking-tight mb-2 font-sans transition-colors ${isSelected ? "text-accent" : "text-foreground group-hover:text-accent"}`}>
                  {dept.name}
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {dept.description}
                </p>
              </div>

              {/* Card Footer Prompt */}
              <div className="mt-5 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] font-mono">
                <span className={isSelected ? "text-accent font-semibold" : "text-muted-foreground group-hover:text-foreground transition-colors"}>
                  {isSelected ? "DEPARTMENT SELECTED" : "SELECT DOMAIN"}
                </span>
                <span className={`transition-transform duration-300 ${isSelected ? "translate-x-0 text-accent" : "group-hover:translate-x-1 text-muted-foreground"}`}>
                  {isSelected ? "✓" : "→"}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      <input type="hidden" {...register("department", { required: "Please select a department to proceed." })} />

      {errors.department && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-4 text-destructive text-xs font-semibold flex items-center gap-2">
          ⚠️ {errors.department.message}
        </motion.p>
      )}
    </motion.div>
  );
};

export default DepartmentSelector;
