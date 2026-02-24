// ============================================
// JOB TYPES - ZOD SCHEMAS & TYPE INFERENCE
// ============================================

import { z } from "zod";
import { de } from "zod/v4/locales";
import { Speciality, SpecialitySchema, SPECIALTY_LABELS } from "./general";

// --- SCHEMAS ---

/**
 * Job status schema
 */
export const JobStatusSchema = z.enum(["draft", "active", "paused", "expired"]);

/**
 * Job type schema
 */
export const JobTypeSchema = z.enum([
  "full-time",
  "internship",
  "part-time-working-student",
]);

// --- DB SCHEMAS ---

export const JobRowSchema = z.object({
  id: z.string().uuid(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date().nullable(),
  startup_id: z.string().uuid(),
  status: JobStatusSchema,
  title: z.string(),
  description: z.string(),
  location: z.string().nullable(),
  department: SpecialitySchema.nullable(),
  job_type: JobTypeSchema.nullable(),
});

// --- LABEL MAPPINGS (for display) ---

export const JOB_TYPE_LABELS: Record<JobType, string> = {
  "full-time": "Full-time",
  internship: "Internship",
  "part-time-working-student": "Part-time / Working student",
};

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  draft: "Draft",
  active: "Active",
  paused: "Paused",
  expired: "Expired",
};

// --- TYPE EXPORTS (inferred from schemas) ---

export type JobStatus = z.infer<typeof JobStatusSchema>;
export type JobType = z.infer<typeof JobTypeSchema>;
export type JobRow = z.infer<typeof JobRowSchema>;

// --- HELPER FUNCTIONS ---

export function getDepartmentLabel(department: Speciality | null): string {
  if (!department) return "—";
  return SPECIALTY_LABELS[department] ?? department;
}

export function getJobTypeLabel(jobType: JobType | null): string {
  if (!jobType) return "—";
  return JOB_TYPE_LABELS[jobType] ?? jobType;
}

export function getJobStatusLabel(status: JobStatus | null): string {
  if (!status) return "—";
  return JOB_STATUS_LABELS[status] ?? status;
}
