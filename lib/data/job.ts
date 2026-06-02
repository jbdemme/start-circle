import { createClient } from "@/lib/supabase/server";
import type { JobRow } from "@/lib/schema/job";

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

export async function getActiveJobs(): Promise<JobRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as JobRow[];
}

export async function getStartupJobs(startupId: string): Promise<JobRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("startup_id", startupId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as JobRow[];
}
