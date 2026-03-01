import { z } from "zod";

// Shared enums
export const RoleSchema = z.enum(["talent", "startup"]);
export const ApplicationStatusSchema = z.enum([
  "new",
  "application",
  "in_review",
  "accepted",
  "rejected",
]);

/**
 * Specialty schema used by both jobs (department) and talents (specializations/type).
 */
export const SpecialitySchema = z.enum([
  "generalist",
  "tech",
  "sales-gtm",
  "operations",
  "finance",
  "people-hr",
  "growth-marketing",
  "product",
  "other",
]);

// Display labels
export const SPECIALITY_LABELS: Record<Speciality, string> = {
  generalist: "Generalist",
  tech: "Tech",
  "sales-gtm": "Sales/GTM",
  operations: "Operations",
  finance: "Finance",
  "people-hr": "People/HR",
  "growth-marketing": "Growth/Marketing",
  product: "Product",
  other: "Other",
};

// Shared work/engagement type used by jobs (job_type) and talents (availability)
export const WorkTypeSchema = z.enum([
  "full-time",
  "internship",
  "part-time-working-student",
]);

export const WORK_TYPE_LABELS: Record<WorkType, string> = {
  "full-time": "Full-time",
  internship: "Internship",
  "part-time-working-student": "Part-time / Working student",
};

// Profiles table schema (public.profiles)
export const ProfileSchema = z.object({
  id: z.string(),
  created_at: z.coerce.date(),
  role: RoleSchema,
  status: ApplicationStatusSchema,
  updated_at: z.coerce.date().nullable(),
  email: z.string().email().nullable(),
  full_name: z.string(),
});

// Types
export type Speciality = z.infer<typeof SpecialitySchema>;
export type Role = z.infer<typeof RoleSchema>;
export type ApplicationStatus = z.infer<typeof ApplicationStatusSchema>;
export type WorkType = z.infer<typeof WorkTypeSchema>;
export type Profile = z.infer<typeof ProfileSchema>;

// Generic label lookup to avoid field-specific helpers
export function getLabel<T extends string>(
  value: T | null | undefined,
  labels: Record<T, string>,
  fallback = "—",
): string {
  if (!value) return fallback;
  return labels[value] ?? fallback;
}
