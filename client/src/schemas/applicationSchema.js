import { z } from "zod";

// Shared regex definitions
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const rollNumberRegex = /^2026[a-zA-Z]{3}\d{4}$/;
const urlRegex = /^(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)|[Nn]\/[Aa])$/;

// Personal details (Stage 1)
export const personalDetailsSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().regex(emailRegex, "Invalid email address format"),
  rollNumber: z
    .string()
    .min(1, "Roll Number is required")
    .regex(rollNumberRegex, "Invalid Roll Number format. Example: 2026UIC3525"),
  contactNumber: z.string().min(10, "Contact number must be at least 10 digits"),
  campus: z.enum(["Main", "East", "West"], { required_error: "Select campus" }),
  branch: z.string().min(1, "Branch required"),
  about: z.string().min(1, "Introduction required"),
  whyJoin: z.string().min(1, "Reason to join required"),
  department: z.string().min(1, "Select department"),
});

// Tech Department - base object (without refine, so .merge() works)
const techSchemaBase = z.object({
  motivation: z.string().min(1, "Motivation required"),
  techDomains: z.array(z.string()).min(1, "Select at least one domain (Web Dev, App Dev, etc.)"),
  webDevType: z.string().optional(),
  skills: z.string().min(1, "Frameworks and languages required"),
  portfolioLink: z.string().regex(urlRegex, "Must be a valid link starting with http:// or https://"),
});

// Tech Department - full schema with refinement (exported for standalone use)
export const techSchema = techSchemaBase.refine((data) => {
  if (data.techDomains && data.techDomains.includes("Web Development") && (!data.webDevType || data.webDevType.trim() === "")) {
    return false;
  }
  return true;
}, {
  message: "Please select whether you specialize in Front-end Only or Full-stack",
  path: ["webDevType"],
});

// Graphic Design Department - base object (without refine, so .merge() works)
const graphicDesignSchemaBase = z.object({
  interestReason: z.string().min(1, "Interest reason required"),
  softwaresUsed: z.array(z.string()).min(1, "Select at least one software"),
  otherSoftware: z.string().optional(),
  driveLink: z.string().regex(urlRegex, "Must be a valid drive link starting with http:// or https://"),
});

// Graphic Design - full schema with refinement (exported for standalone use)
export const graphicDesignSchema = graphicDesignSchemaBase.refine((data) => {
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
  portfolioLink: z.string().regex(urlRegex, "Must be a valid link starting with http:// or https://"),
});

// Content Department
export const contentSchema = z.object({
  controversialOpinion: z.string().min(1, "Opinion is required"),
  deskItemStory: z.string().min(1, "Story is required"),
  portfolioLink: z.string().regex(urlRegex, "Must be a valid link starting with http:// or https://, or N/A"),
});

// Video Editing Department
export const videoEditingSchema = z.object({
  editingSoftware: z.string().min(1, "Editing software is required"),
  portfolioLink: z.string().regex(urlRegex, "Must be a valid link starting with http:// or https://"),
});

/**
 * Returns the BASE z.object() schema for a department (safe for .merge()).
 * Tech and GD return their base schemas without .refine() to avoid ZodEffects crash.
 */
export const getDepartmentSchema = (dept) => {
  switch (dept) {
    case "Tech":
      return techSchemaBase;
    case "Graphic Design":
      return graphicDesignSchemaBase;
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

/**
 * Returns a superRefine callback for departments that need conditional validation.
 * Returns null if the department has no extra refinements.
 */
export const getDepartmentRefinement = (dept) => {
  switch (dept) {
    case "Tech":
      return (data, ctx) => {
        if (data.techDomains && data.techDomains.includes("Web Development") && (!data.webDevType || data.webDevType.trim() === "")) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please select whether you specialize in Front-end Only or Full-stack",
            path: ["webDevType"],
          });
        }
      };
    case "Graphic Design":
      return (data, ctx) => {
        if (data.softwaresUsed && data.softwaresUsed.includes("Other") && (!data.otherSoftware || data.otherSoftware.trim() === "")) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please specify other softwares",
            path: ["otherSoftware"],
          });
        }
      };
    default:
      return null;
  }
};
