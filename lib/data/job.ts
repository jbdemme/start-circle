import { createClient } from "@/lib/supabase/server";
import type { JobRow } from "@/lib/types/job";

/**
 * Fetch a single job by ID.
 * Uses server-side Supabase client for SSR support.
 *
 * @param id - The job ID to fetch
 * @returns The job data or null if not found
 */
export async function getJobById(id: string): Promise<JobRow | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  return data as JobRow;
}
