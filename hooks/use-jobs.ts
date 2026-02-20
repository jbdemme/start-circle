"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { jobKeys } from "@/lib/queries/keys";
import type { JobRow, JobListing } from "@/lib/types/job";

/**
 * Fetch jobs directly from Supabase with explicit startup filter.
 * RLS also ensures only the startup's jobs are returned.
 */
async function fetchJobs(): Promise<JobRow[]> {
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Not authenticated");
  }

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("startup_id", user.id) // Explicit filter: only this startup's jobs
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/**
 * Hook to fetch all jobs for the authenticated startup.
 * Uses explicit WHERE clause + RLS for security.
 *
 * @example
 * ```tsx
 * const { data: jobs, isLoading, error } = useJobs();
 * ```
 */
export function useJobs() {
  return useQuery({
    queryKey: jobKeys.lists(),
    queryFn: fetchJobs,
  });
}

/**
 * Hook to fetch jobs transformed for display in the job listings table.
 * Transforms JobRow to JobListing format.
 *
 * @example
 * ```tsx
 * const { data: jobListings, isLoading, error } = useJobListings();
 * ```
 */
export function useJobListings() {
  const { data: jobs, ...queryResult } = useJobs();

  const jobListings: JobListing[] | undefined = jobs?.map(
    transformJobRowToListing,
  );

  return { ...queryResult, data: jobListings };
}

/**
 * Transform a JobRow from the database to a JobListing for display.
 */
function transformJobRowToListing(job: JobRow): JobListing {
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
 * Hook to invalidate jobs cache.
 * Use this after creating, updating, or deleting jobs.
 *
 * @example
 * ```tsx
 * const invalidateJobs = useInvalidateJobs();
 * await invalidateJobs();
 * ```
 */
export function useInvalidateJobs() {
  const queryClient = useQueryClient();

  return () =>
    queryClient.invalidateQueries({
      queryKey: jobKeys.lists(),
    });
}
