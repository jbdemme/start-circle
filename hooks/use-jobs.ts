"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { jobKeys } from "@/lib/queries/keys";
import {
  JobRowSchema,
  transformJobRowToListing as transformJobRow,
  type JobRow,
  type JobListing,
} from "@/lib/types/job";

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
 * Fetch a single job by ID directly from Supabase.
 *
 * @param id - The job ID to fetch
 */
async function fetchJobById(id: string): Promise<JobRow> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .single();

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
 * Hook to fetch a single job by ID.
 * Uses TanStack Query for caching and automatic refetching.
 *
 * @param id - The job ID to fetch
 * @param options - Optional query options (e.g., enabled)
 *
 * @example
 * ```tsx
 * const { data: job, isLoading, error } = useJob("123");
 * ```
 */
export function useJob(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: jobKeys.detail(id),
    queryFn: () => fetchJobById(id),
    enabled: options?.enabled ?? !!id,
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

  const jobListings: JobListing[] | undefined = jobs?.map(transformJobRow);

  return { ...queryResult, data: jobListings };
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
