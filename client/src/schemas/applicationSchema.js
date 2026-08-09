import { z } from "zod";

// Shared regex definitions
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const rollNumberRegex = /^2026[A-Z]{3}\d{4}$/;
const urlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

// Personal details (Stage 1)
export const personalDetailsSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().regex(emailRegex, "Invalid email address format"),
  rollNumber: z.string().regex(rollNumberRegex, "Invalid NSUT Roll Number format (e.g. 2026UIN3341)"),
  contactNumber: z.string().min(10, "Contact number must be at least 10 digits"),
  campus: z.enum(["Main", "East", "West"], { required_error: "Select campus" }),
  branch: z.string().min(1, "Branch required"),
  about: z.string().min(1, "Introduction required"),
  whyJoin: z.string().min(1, "Reason to join required"),
  department: z.string().min(1, "Select department"),
});

// Tech Department
export const techSchema = z.object({
  motivation: z.string().min(1, "Motivation required"),
  skills: z.string().min(1, "Frameworks and languages required"),
  portfolioLink: z.string().regex(urlRegex, "Must be a valid web link (starting with http:// or https://)"),
});

// Graphic Design Department
export const graphicDesignSchema = z.object({
  interestReason: z.string().min(1, "Interest reason required"),
  softwaresUsed: z.array(z.string()).min(1, "Select at least one software"),
  otherSoftware: z.string().optional(),
  driveLink: z.string().regex(urlRegex, "Must be a valid drive link (starting with http:// or https://)"),
}).refine((data) => {
  if (data.softwaresUsed.includes("Other") && (!data.otherSoftware || data.otherSoftware.trim() === "")) {
    return false;
  }
  return true;
}, {
  message: "Please specify other softwares",
  path: ["otherSoftware"],
});

// Photography Department
export const photographySchema = z.object({
  cameraModel: z.string().min(1, "Camera details required"),
  phoneModel: z.string().min(1, "Phone details required"),
  experienceLevel: z.enum(["Beginner", "Intermediate", "Advanced"], { required_error: "Select experience level" }),
  portfolioLink: z.string().regex(urlRegex, "Must be a valid drive link (starting with http:// or https://)"),
});

// Content Department
export const contentSchema = z.object({
  controversialOpinion: z.string().min(1, "Opinion is required"),
  deskItemStory: z.string().min(1, "Story is required"),
  portfolioLink: z.string().regex(urlRegex, "Must be a valid drive link (starting with http:// or https://)"),
});

// Video Editing Department
export const videoEditingSchema = z.object({
  editingSoftware: z.string().min(1, "Editing software is required"),
  portfolioLink: z.string().regex(urlRegex, "Must be a valid drive link (starting with http:// or https://)"),
});

export const getDepartmentSchema = (dept) => {
  switch (dept) {
    case "Tech":
      return techSchema;
    case "Graphic Design":
      return graphicDesignSchema;
    case "Photography":
      return photographySchema;
    case "Content":
      return contentSchema;
    case "Video Editing":
      return videoEditingSchema;
    default:
      return z.object({});
  }
};
