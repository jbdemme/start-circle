// ============================================
// JOB TYPES - ZOD SCHEMAS & TYPE INFERENCE
// ============================================

import { z } from "zod";

// --- SCHEMAS ---

/**
 * Job status schema
 */
export const JobStatusSchema = z.enum(["draft", "active", "paused", "expired"]);

/**
 * Department schema
 */
export const DepartmentSchema = z.enum([
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

/**
 * Job type schema
 */
export const JobTypeSchema = z.enum([
  "full-time",
  "internship",
  "part-time-working-student",
]);

// --- LABEL MAPPINGS (for display) ---

export const DEPARTMENT_LABELS: Record<Department, string> = {
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
export type Department = z.infer<typeof DepartmentSchema>;
export type JobType = z.infer<typeof JobTypeSchema>;

// --- DATABASE ROW SCHEMA ---

/**
 * Schema for the raw database row from Supabase jobs table
 */
export const JobRowSchema = z.object({
  id: z.number(),
  created_at: z.string(),
  updated_at: z.string().nullable(),
  startup_id: z.string(),
  status: JobStatusSchema,
  title: z.string(),
  description: z.string(),
  location: z.string().nullable(),
  department: DepartmentSchema.nullable(),
  job_type: JobTypeSchema.nullable(),
});

export type JobRow = z.infer<typeof JobRowSchema>;

// --- FORM DATA SCHEMA ---

/**
 * Schema for creating/editing jobs via forms
 */
export const JobFormDataSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  department: DepartmentSchema.nullable(),
  jobType: JobTypeSchema.nullable(),
});

export type JobFormData = z.infer<typeof JobFormDataSchema>;

// --- DISPLAY TYPE SCHEMA ---

/**
 * Schema for job listings display
 */
export const JobListingSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  location: z.string(),
  department: DepartmentSchema.nullable(),
  jobType: JobTypeSchema.nullable(),
  status: JobStatusSchema,
  createdAt: z.date().optional(),
  applicationsCount: z.number().optional(),
});

export type JobListing = z.infer<typeof JobListingSchema>;

// --- HELPER FUNCTIONS ---

export function getDepartmentLabel(department: Department | null): string {
  return department ? (DEPARTMENT_LABELS[department] ?? department) : "—";
}

export function getJobTypeLabel(jobType: JobType | null): string {
  return jobType ? (JOB_TYPE_LABELS[jobType] ?? jobType) : "—";
}

export function getJobStatusLabel(status: JobStatus | null): string {
  return status ? (JOB_STATUS_LABELS[status] ?? status) : "—";
}

/**
 * Transform a JobRow from the database to a JobListing for display.
 */
export function transformJobRowToListing(job: JobRow): JobListing {
  return {
    id: String(job.id),
    title: job.title,
    description: job.description,
    location: job.location ?? "",
    department: job.department,
    jobType: job.job_type,
    status: job.status,
    createdAt: new Date(job.created_at),
  };
}

/**
 * Validate and parse a job row from the database.
 * Returns the parsed data or throws a ZodError.
 */
export function parseJobRow(data: unknown): JobRow {
  return JobRowSchema.parse(data);
}

/**
 * Safely parse a job row, returning null if invalid.
 */
export function safeParseJobRow(data: unknown): JobRow | null {
  const result = JobRowSchema.safeParse(data);
  return result.success ? result.data : null;
}
