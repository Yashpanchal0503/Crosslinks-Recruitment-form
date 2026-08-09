import { z } from "zod";

// Personal details (Stage 1)
export const personalDetailsSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  rollNumber: z.string().min(1, "Roll number required"),
  contactNumber: z.string().min(10, "Contact number required"),
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
  portfolioLink: z.string().url("Must be a valid URL").or(z.literal("")),
});

// Graphic Design Department
export const graphicDesignSchema = z.object({
  interestReason: z.string().min(1, "Interest reason required"),
  softwaresUsed: z.array(z.string()).min(1, "Select at least one software").or(z.string().min(1, "Softwares used required")),
  taskLink: z.string().url("Must be a valid URL"),
  brownieLink: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  previousWorkLink: z.string().min(1, "Previous work link or N/A is required"),
});

// Photography Department
export const photographySchema = z.object({
  cameraModel: z.string().min(1, "Camera details required"),
  phoneModel: z.string().min(1, "Phone details required"),
  experienceLevel: z.enum(["Beginner", "Intermediate", "Advanced"], { required_error: "Select experience level" }),
  portfolioLink: z.string().url("Must be a valid URL"),
});

// Content Department
export const contentSchema = z.object({
  controversialOpinion: z.string().min(1, "Opinion is required"),
  deskItemStory: z.string().min(1, "Story is required"),
  portfolioLink: z.string().url("Must be a valid URL"),
});

// Video Editing Department
export const videoEditingSchema = z.object({
  editingSoftware: z.string().min(1, "Editing software is required"),
  portfolioLink: z.string().url("Must be a valid URL"),
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
