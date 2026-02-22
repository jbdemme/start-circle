import { z } from "zod";
import { DepartmentSchema, JobTypeSchema } from "./types/job";

/**
 * Schema for creating/editing jobs via forms
 * Used with react-hook-form via zodResolver
 */
export const newJobSchema = z.object({
  title: z
    .string()
    .min(5, "Job title must be at least 5 characters")
    .max(80, "Job title must be less than 80 characters"),
  description: z
    .string()
    .max(5000, "Description must be less than 5000 characters"),
  location: z.string().max(50, "Location must be less than 50 characters"),
  department: DepartmentSchema.nullable(),
  jobType: JobTypeSchema.nullable(),
});

export type NewJobFormData = z.infer<typeof newJobSchema>;
