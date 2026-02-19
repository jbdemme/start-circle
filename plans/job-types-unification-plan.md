# Job Types & Schema Unification Plan

## Overview

This plan establishes a single source of truth for job-related schemas and types across the codebase. The goal is to eliminate type fragmentation and ensure consistency between the database, forms, and display components.

## Database Schema (Source of Truth)

```sql
CREATE TABLE public.jobs (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone,
  startup_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'draft'::text,
  title text NOT NULL,
  description text NOT NULL,
  location text,
  -- NEW COLUMNS TO ADD:
  department text,
  job_type text,
  CONSTRAINT jobs_pkey PRIMARY KEY (id),
  CONSTRAINT jobs_startup_id_fkey FOREIGN KEY (startup_id) REFERENCES public.startups(user_id)
);
```

### Database Migration

Run this SQL in Supabase:

```sql
ALTER TABLE public.jobs
ADD COLUMN department text,
ADD COLUMN job_type text;
```

---

## Unified Type Definitions

### Departments

| Value              | Display Label    |
| ------------------ | ---------------- |
| `generalist`       | Generalist       |
| `tech`             | Tech             |
| `sales-gtm`        | Sales/GTM        |
| `operations`       | Operations       |
| `finance`          | Finance          |
| `people-hr`        | People/HR        |
| `growth-marketing` | Growth/Marketing |
| `product`          | Product          |
| `other`            | Other            |

### Job Types

| Value                       | Display Label               |
| --------------------------- | --------------------------- |
| `full-time`                 | Full-time                   |
| `internship`                | Internship                  |
| `part-time-working-student` | Part-time / Working student |

### Job Status

| Value     | Display Label |
| --------- | ------------- |
| `draft`   | Draft         |
| `active`  | Active        |
| `paused`  | Paused        |
| `expired` | Expired       |

---

## Current Fragmentation Issues

| File                                                                                           | Current State                                                                 | Issue                                    |
| ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ---------------------------------------- |
| [`lib/schema.ts`](lib/schema.ts)                                                               | `department: z.enum(["Tech", "GTM", "operations", "other"])`                  | Inconsistent casing, missing departments |
| [`lib/schema.ts`](lib/schema.ts)                                                               | `jobType: z.enum(["full-time", "internship", "part-time / working student"])` | Space/slash in value                     |
| [`components/forms/new_job_form.tsx`](components/forms/new_job_form.tsx)                       | Separate `part-time` and `working student` options                            | Mismatch with schema                     |
| [`components/job-listings-table.tsx`](components/job-listings-table.tsx)                       | Local `Department`, `JobType`, `JobListing` types                             | Duplicated definitions                   |
| [`components/dashboard/active-jobs-preview.tsx`](components/dashboard/active-jobs-preview.tsx) | Local `JobListing` interface                                                  | Different structure                      |
| [`app/dashboard/(sidebar)/jobs/columns.tsx`](<app/dashboard/(sidebar)/jobs/columns.tsx>)       | Local `Job` type with `level` field                                           | Uses `level` instead of `jobType`        |

---

## Implementation Plan

### Step 1: Create `lib/types/job.ts`

New file containing all job-related type definitions as the single source of truth:

```typescript
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
  department: Department;
  jobType: JobType;
}

// Display type for job listings
export interface JobListing {
  id: string;
  title: string;
  description: string;
  location: string;
  department: Department;
  jobType: JobType;
  status: JobStatus;
  createdAt?: Date;
  applicationsCount?: number;
}

// --- HELPER FUNCTIONS ---

export function getDepartmentLabel(department: Department): string {
  return DEPARTMENT_LABELS[department];
}

export function getJobTypeLabel(jobType: JobType): string {
  return JOB_TYPE_LABELS[jobType];
}

export function getJobStatusLabel(status: JobStatus): string {
  return JOB_STATUS_LABELS[status];
}
```

### Step 2: Update `lib/schema.ts`

```typescript
import * as z from "zod";
import { DEPARTMENT, JOB_TYPE } from "./types/job";

export const newJobSchema = z.object({
  title: z
    .string()
    .min(5, "Job title must be at least 5 characters")
    .max(80, "Job title must be less than 80 characters"),
  description: z
    .string()
    .max(5000, "Description must be less than 5000 characters"),
  location: z.string().max(50, "Location must be less than 50 characters"),
  department: z.enum([
    DEPARTMENT.GENERALIST,
    DEPARTMENT.TECH,
    DEPARTMENT.SALES_GTM,
    DEPARTMENT.OPERATIONS,
    DEPARTMENT.FINANCE,
    DEPARTMENT.PEOPLE_HR,
    DEPARTMENT.GROWTH_MARKETING,
    DEPARTMENT.PRODUCT,
    DEPARTMENT.OTHER,
  ]),
  jobType: z.enum([
    JOB_TYPE.FULL_TIME,
    JOB_TYPE.INTERNSHIP,
    JOB_TYPE.PART_TIME_WORKING_STUDENT,
  ]),
});

export type NewJobFormData = z.infer<typeof newJobSchema>;
```

### Step 3: Update `lib/actions.ts`

Update the `newJob` function to use the new types:

```typescript
import { revalidatePath } from "next/cache";
import { type JobFormData } from "./types/job";

export async function createJob(
  startupId: string,
  data: JobFormData,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase.from("jobs").insert({
    startup_id: startupId,
    title: data.title,
    description: data.description,
    location: data.location,
    department: data.department,
    job_type: data.jobType,
    status: "draft",
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/jobs");
  return { success: true };
}
```

### Step 4: Update `components/forms/new_job_form.tsx`

Update the form to use shared types and correct Select options:

```typescript
import {
  DEPARTMENT,
  JOB_TYPE,
  DEPARTMENT_LABELS,
  JOB_TYPE_LABELS,
  type JobFormData
} from '@/lib/types/job';

// In the department Select:
<SelectContent position="popper">
  {Object.entries(DEPARTMENT_LABELS).map(([value, label]) => (
    <SelectItem key={value} value={value}>
      {label}
    </SelectItem>
  ))}
</SelectContent>

// In the jobType Select:
<SelectContent position="popper">
  {Object.entries(JOB_TYPE_LABELS).map(([value, label]) => (
    <SelectItem key={value} value={value}>
      {label}
    </SelectItem>
  ))}
</SelectContent>
```

### Step 5: Update `components/job-listings-table.tsx`

Remove local type definitions and import from shared types:

```typescript
import {
  type JobListing,
  type Department,
  type JobType,
  type JobStatus,
  DEPARTMENT_LABELS,
  JOB_TYPE_LABELS,
  JOB_STATUS_LABELS,
} from "@/lib/types/job";

// Remove these local definitions:
// - export type JobStatus = ...
// - export type Department = ...
// - export type JobType = ...
// - export interface JobListing = ...
```

### Step 6: Update `components/dashboard/active-jobs-preview.tsx`

Remove local `JobListing` interface and import shared type:

```typescript
import { type JobListing } from "@/lib/types/job";

// Remove: export interface JobListing { ... }
```

### Step 7: Update `app/dashboard/(sidebar)/jobs/columns.tsx`

Replace local `Job` type with shared `JobRow` type:

```typescript
import { type JobRow, type JobStatus, JOB_STATUS_LABELS } from '@/lib/types/job';

// Remove: export type Job = { ... }

// Update column definitions to use JobRow
export const columns: ColumnDef<JobRow>[] = [ ... ];
```

---

## File Structure After Changes

```
lib/
├── types/
│   └── job.ts              # NEW: Single source of truth
├── schema.ts               # UPDATED: Uses type constants
├── actions.ts              # UPDATED: Uses JobFormData type
└── ...

components/
├── forms/
│   └── new_job_form.tsx    # UPDATED: Uses shared types
├── job-listings-table.tsx  # UPDATED: Removes local types
├── dashboard/
│   └── active-jobs-preview.tsx  # UPDATED: Uses shared types
└── ...

app/dashboard/(sidebar)/jobs/
└── columns.tsx             # UPDATED: Uses JobRow type
```

---

## Migration Checklist

- [ ] Run database migration to add `department` and `job_type` columns
- [ ] Create `lib/types/job.ts` with unified type definitions
- [ ] Update `lib/schema.ts` to use type constants
- [ ] Update `lib/actions.ts` to use `JobFormData` type
- [ ] Update `components/forms/new_job_form.tsx` to use shared types
- [ ] Update `components/job-listings-table.tsx` to use shared types
- [ ] Update `components/dashboard/active-jobs-preview.tsx` to use shared types
- [ ] Update `app/dashboard/(sidebar)/jobs/columns.tsx` to use shared types
- [ ] Verify TypeScript compilation passes
- [ ] Test form submission with new types
