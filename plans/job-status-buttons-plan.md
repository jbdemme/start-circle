# Job Status Buttons Implementation Plan

## Overview

Modify the job-listings-table to show contextual action buttons based on job status:

- **Publish button**: Show when status is NOT active (draft, paused, expired)
- **Pause button**: Show when status IS active

## Current State Analysis

### Current Implementation

In [`job-listings-table.tsx`](components/job-listings-table.tsx:131-139), the Publish button is:

```tsx
<DropdownMenuItem
  onSelect={() => {
    onPublish?.(job.id);
  }}
  disabled={job.status !== "draft"}
>
  <Rocket className="mr-2 h-4 w-4" />
  Publish
</DropdownMenuItem>
```

### Job Status Values

From [`lib/types/job.ts`](lib/types/job.ts:7-12):

- `draft` - Initial state for new jobs
- `active` - Published and visible
- `paused` - Temporarily taken down
- `expired` - Past expiration date

## Implementation Plan

### Step 1: Create Generic updateJobStatus Server Action

**File**: [`lib/actions.ts`](lib/actions.ts)

Replace `publishJob` with a generic `updateJobStatus` function that takes the desired status as a parameter:

```typescript
export async function updateJobStatus(
  jobId: string,
  status: "draft" | "active" | "paused" | "expired",
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("jobs")
    .update({ status })
    .eq("id", jobId)
    .select();

  if (error || !data || data.length === 0) {
    return { success: false, error: error?.message || "Job not found" };
  }

  revalidatePath("/dashboard/jobs");
  return { success: true };
}

/**
 * @deprecated Use updateJobStatus instead
 */
export async function publishJob(
  jobId: string,
): Promise<{ success: boolean; error?: string }> {
  return updateJobStatus(jobId, "active");
}
```

This approach:

- Provides a single reusable function for all status changes
- Maintains backward compatibility by keeping `publishJob` as a wrapper
- Can be used for publishing (active), pausing (paused), or any other status transition

### Step 2: Update JobListingsTableProps Interface

**File**: [`components/job-listings-table.tsx`](components/job-listings-table.tsx:43-48)

Add the `onPause` callback:

```typescript
interface JobListingsTableProps {
  data: JobListing[];
  onPublish?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onPause?: (id: string) => void; // NEW
}
```

### Step 3: Modify Dropdown Menu

**File**: [`components/job-listings-table.tsx`](components/job-listings-table.tsx:129-152)

Replace the current Publish button logic with conditional rendering:

```tsx
<DropdownMenuContent align="end">
  <DropdownMenuLabel>Actions</DropdownMenuLabel>

  {/* Publish button - show when NOT active */}
  {job.status !== "active" && (
    <DropdownMenuItem
      onSelect={() => {
        onPublish?.(job.id);
      }}
    >
      <Rocket className="mr-2 h-4 w-4" />
      Publish
    </DropdownMenuItem>
  )}

  {/* Pause button - show when active */}
  {job.status === "active" && (
    <DropdownMenuItem
      onSelect={() => {
        onPause?.(job.id);
      }}
    >
      <Pause className="mr-2 h-4 w-4" />
      Pause
    </DropdownMenuItem>
  )}

  <DropdownMenuItem onSelect={() => onEdit?.(job.id)}>
    <Edit className="mr-2 h-4 w-4" />
    Edit
  </DropdownMenuItem>
  <DropdownMenuSeparator />
  <DropdownMenuItem variant="destructive" onSelect={() => onDelete?.(job.id)}>
    <Trash2 className="mr-2 h-4 w-4" />
    Delete
  </DropdownMenuItem>
</DropdownMenuContent>
```

### Step 4: Import Pause Icon

**File**: [`components/job-listings-table.tsx`](components/job-listings-table.tsx:29)

Add `Pause` to the lucide-react imports:

```typescript
import { Edit, MoreHorizontal, Pause, Rocket, Trash2 } from "lucide-react";
```

### Step 5: Update Jobs Page Handlers

**File**: [`app/dashboard/(sidebar)/jobs/page.tsx`](<app/dashboard/(sidebar)/jobs/page.tsx:269-281>)

Update imports and handlers to use the generic `updateJobStatus`:

```typescript
import { updateJobStatus } from "@/lib/actions";

// ... existing handlers

const handlePublish = (id: string) => {
  toast.promise(updateJobStatus(id, "active"), {
    loading: "Publishing job...",
    success: (result) => {
      if (result.success) {
        invalidateJobs();
        return "Job published successfully";
      }
      throw new Error(result.error || "Failed to publish job");
    },
    error: (err) => err.message || "Failed to publish job",
  });
};

const handlePause = (id: string) => {
  toast.promise(updateJobStatus(id, "paused"), {
    loading: "Pausing job...",
    success: (result) => {
      if (result.success) {
        invalidateJobs();
        return "Job paused successfully";
      }
      throw new Error(result.error || "Failed to pause job");
    },
    error: (err) => err.message || "Failed to pause job",
  });
};
```

### Step 6: Pass onPause to JobListingsTable

**File**: [`app/dashboard/(sidebar)/jobs/page.tsx`](<app/dashboard/(sidebar)/jobs/page.tsx:359-364>)

Update the component props:

```tsx
<JobListingsTable
  data={jobListings}
  onPublish={handlePublish}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onPause={handlePause}
/>
```

## Summary of Changes

| File                                                                               | Change                                                                                      |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| [`lib/actions.ts`](lib/actions.ts)                                                 | Add generic `updateJobStatus` server action, deprecate `publishJob`                         |
| [`components/job-listings-table.tsx`](components/job-listings-table.tsx)           | Update props interface, add Pause icon import, modify dropdown menu with conditional render |
| [`app/dashboard/(sidebar)/jobs/page.tsx`](<app/dashboard/(sidebar)/jobs/page.tsx>) | Update imports to use `updateJobStatus`, add `handlePause` callback and pass to table       |

## Button Visibility Matrix

| Status  | Publish Button | Pause Button |
| ------- | -------------- | ------------ |
| draft   | ✅ Visible     | ❌ Hidden    |
| active  | ❌ Hidden      | ✅ Visible   |
| paused  | ✅ Visible     | ❌ Hidden    |
| expired | ✅ Visible     | ❌ Hidden    |
