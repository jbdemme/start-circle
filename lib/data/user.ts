import { createClient } from "@/lib/supabase/server";
import { cache } from "react";

// The 'cache' function ensures this runs only once per request
export const getMyProfile = cache(async () => {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (!user || error) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile;
});
