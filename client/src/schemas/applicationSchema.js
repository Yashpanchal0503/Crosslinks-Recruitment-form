import { z } from "zod";

// Personal details (Stage 1)
export const personalDetailsSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  rollNumber: z.string().min(1, "Roll number required"),
  contactNumber: z.string().min(10, "Contact number required"),
  campus: z.enum(["Main", "East", "West"], { required_error: "Select campus" }),
  branch: z.string().min(1, "Branch required"),
  about: z.string().min(1, "Tell us about yourself"),
  whyJoin: z.string().min(1, "Why join CrossLinks?") ,
  department: z.string().min(1, "Select department"),
});

// Department specific schemas
export const techSchema = z.object({
  programmingLanguages: z.string().min(1, "Required"),
  frameworks: z.string().optional(),
  projects: z.string().optional(),
});

export const graphicDesignSchema = z.object({
  tools: z.string().min(1, "Required"),
  portfolioLink: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
});

export const photographySchema = z.object({
  cameraGear: z.string().min(1, "Required"),
  portfolioLink: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
});

export const contentSchema = z.object({
  writingSamples: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  topicsOfInterest: z.string().min(1, "Required"),
});

export const videoEditingSchema = z.object({
  editingSoftware: z.string().min(1, "Required"),
  demoReelLink: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
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
      return z.object({}); // empty schema for safety
  }
};
