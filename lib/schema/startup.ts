import z from "zod";

// Base startup row (supabase)
export const StartupRowSchema = z.object({
  user_id: z.string(),
  company_name: z.string().nullable(),
  website_url: z.string().url().nullable(),
  description: z.string().nullable(),
});

export type StartupRow = z.infer<typeof StartupRowSchema>;

export const StartupApplicationSchema = z.object({
  startupName: z.string().min(1, "Startup name is required"),
  website: z.string().url("Invalid URL"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(1000, "Description must be less than 1000 characters"),
});
