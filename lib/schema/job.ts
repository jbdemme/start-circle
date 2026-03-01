import { z } from "zod";
import {
  Speciality,
  SpecialitySchema,
  SPECIALITY_LABELS,
  WorkTypeSchema,
  WORK_TYPE_LABELS,
  type WorkType,
  getLabel,
} from "./general";

export const JobStatusSchema = z.enum(["draft", "active", "paused", "expired"]);
export const JobTypeSchema = WorkTypeSchema;

const jobCoreSchema = {
  title: z
    .string()
    .min(5, "Job title must be at least 5 characters")
    .max(80, "Job title must be less than 80 characters"),
  description: z
    .string()
    .max(5000, "Description must be less than 5000 characters"),
  location: z.string().max(50, "Location must be less than 50 characters"),
  department: SpecialitySchema.nullable(),
  job_type: WorkTypeSchema.nullable(),
};

// Form payload for creating/updating a job
export const jobFormSchema = z.object(jobCoreSchema);
export type JobFormData = z.infer<typeof jobFormSchema>;

// Full database row shape for the jobs table
export const JobRowSchema = z.object({
  id: z.string().uuid(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date().nullable(),
  startup_id: z.string().uuid(),
  status: JobStatusSchema,
  ...jobCoreSchema,
});
export type JobRow = z.infer<typeof JobRowSchema>;

// UI listing uses the same shape as JobRow
export type JobListing = JobRow;

export const JOB_TYPE_LABELS: Record<JobType, string> = WORK_TYPE_LABELS;

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  draft: "Draft",
  active: "Active",
  paused: "Paused",
  expired: "Expired",
};

export type JobStatus = z.infer<typeof JobStatusSchema>;
export type JobType = WorkType;

export function getDepartmentLabel(department: Speciality | null): string {
  return getLabel(department as Speciality | null, SPECIALITY_LABELS);
}

export function getJobTypeLabel(jobType: JobType | null): string {
  return getLabel(jobType as WorkType | null, WORK_TYPE_LABELS);
}

export function getJobStatusLabel(status: JobStatus | null): string {
  return getLabel(status as JobStatus | null, JOB_STATUS_LABELS);
}
