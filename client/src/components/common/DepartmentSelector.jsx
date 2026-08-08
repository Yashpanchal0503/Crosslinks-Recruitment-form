import React from "react";
import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";
import { Cpu, Image, Camera, Edit, Video } from "lucide-react";

const departments = [
  {
    key: "Tech",
    name: "Tech",
    icon: <Cpu className="w-6 h-6" />,
    description: "Develop web apps, APIs, and scripts",
  },
  {
    key: "Graphic Design",
    name: "Graphic Design",
    icon: <Image className="w-6 h-6" />,
    description: "Create visuals, UI kits, and branding assets",
  },
  {
    key: "Photography",
    name: "Photography",
    icon: <Camera className="w-6 h-6" />,
    description: "Capture moments, edit photos, and manage portfolios",
  },
  {
    key: "Content",
    name: "Content",
    icon: <Edit className="w-6 h-6" />,
    description: "Write copy, manage blog posts, and plan campaigns",
  },
  {
    key: "Video Editing",
    name: "Video Editing",
    icon: <Video className="w-6 h-6" />,
    description: "Edit videos, add motion graphics, and produce reels",
  },
];

const DepartmentSelector = () => {
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  const selected = watch("department");

  const handleSelect = (dept) => {
    setValue("department", dept, { shouldValidate: true });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl glass-card p-6 sm:p-8"
    >
      <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4">Choose a Department</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <motion.button
            key={dept.key}
            type="button"
            onClick={() => handleSelect(dept.key)}
            className={`flex flex-col items-center justify-center gap-3 p-5 rounded-xl border-2 transition-all duration-200 ${selected === dept.key ? "border-violet-500 bg-violet-500/10 glow-accent" : "border-slate-600 hover:border-violet-400 bg-slate-900/30"}`}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            <div className="text-violet-400">{dept.icon}</div>
            <span className="text-lg font-medium text-white">{dept.name}</span>
            <p className="text-sm text-slate-400 text-center">{dept.description}</p>
          </motion.button>
        ))}
      </div>
      <input type="hidden" {...register("department", { required: "Select a department" })} />
      {errors.department && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-2 text-red-400 text-sm">{errors.department.message}</motion.p>
      )}
    </motion.div>
  );
};

export default DepartmentSelector;
