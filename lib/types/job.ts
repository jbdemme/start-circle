// ============================================
// JOB TYPES - SINGLE SOURCE OF TRUTH
// ============================================

// --- CONSTANTS ---

export const JOB_STATUS = {
  DRAFT: "draft",
  ACTIVE: "active",
  PAUSED: "paused",
  EXPIRED: "expired",
} as const;

export const DEPARTMENT = {
  GENERALIST: "generalist",
  TECH: "tech",
  SALES_GTM: "sales-gtm",
  OPERATIONS: "operations",
  FINANCE: "finance",
  PEOPLE_HR: "people-hr",
  GROWTH_MARKETING: "growth-marketing",
  PRODUCT: "product",
  OTHER: "other",
} as const;

export const JOB_TYPE = {
  FULL_TIME: "full-time",
  INTERNSHIP: "internship",
  PART_TIME_WORKING_STUDENT: "part-time-working-student",
} as const;

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

// --- TYPE EXPORTS ---

export type JobStatus = (typeof JOB_STATUS)[keyof typeof JOB_STATUS];
export type Department = (typeof DEPARTMENT)[keyof typeof DEPARTMENT];
export type JobType = (typeof JOB_TYPE)[keyof typeof JOB_TYPE];

// --- INTERFACE DEFINITIONS ---

// Database row type (matches Supabase jobs table)
export interface JobRow {
  id: number;
  created_at: string;
  updated_at: string | null;
  startup_id: string;
  status: JobStatus;
  title: string;
  description: string;
  location: string | null;
  department: Department | null;
  job_type: JobType | null;
}

// Form input type for creating/editing jobs
export interface JobFormData {
  title: string;
  description: string;
  location: string;
  department: Department | null;
  jobType: JobType | null;
}

// Display type for job listings
export interface JobListing {
  id: string;
  title: string;
  description: string;
  location: string;
  department: Department | null;
  jobType: JobType | null;
  status: JobStatus;
  createdAt?: Date;
  applicationsCount?: number;
}

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
