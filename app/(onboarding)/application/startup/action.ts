"use server";

import { StartupApplicationSchema } from "@/lib/schema/startup";
import { createServerSupabaseClient } from "@/utils/supabase/client-server";
import { clerkClient, currentUser } from "@clerk/nextjs/server";

export type FormState = {
  error: string;
};

export async function submitStartupApplication(
  initialState: FormState,
  formData: FormData,
) {
  console.log("Received startup application data:", formData);

  // validate form data
  const validatedData = StartupApplicationSchema.safeParse({
    startupName: formData.get("startupName"),
    website: formData.get("website"),
    description: formData.get("description"),
  });

  if (!validatedData.success) {
    return { error: validatedData.error.issues[0].message };
  }

  // upload data to supabase
  const user = await currentUser();
  if (!user) return { error: "User not authenticated" };

  const supabase = await createServerSupabaseClient();

  const { error: profileError } = await supabase.from("profiles").upsert({
    id: user.id,
    role: "startup",
    status: "in_review",
    email: user.primaryEmailAddress?.emailAddress || null,
    full_name: validatedData.data.startupName,
  });

  const { error: startupError } = await supabase.from("startups").upsert({
    user_id: user.id,
    company_name: validatedData.data.startupName,
    website_url: validatedData.data.website,
    description: validatedData.data.description,
  });

  if (profileError || startupError) {
    console.error("Supabase error:", profileError || startupError);
    return { error: "Failed to submit application. Please try again." };
  }

  // update clerk metadata
  try {
    const client = await clerkClient();
    client.users.updateUser(user.id, {
      publicMetadata: {
        app_role: "startup",
        app_status: "in_review",
      },
    });
  } catch (clerkError) {
    console.error("Clerk error:", clerkError);
    return { error: "Failed to update user metadata. Please try again." };
  }

  return { error: "" };
}
