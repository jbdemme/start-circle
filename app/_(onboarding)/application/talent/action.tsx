"use server";

import { talentApplicationSchema } from "@/lib/schema";
import { createServerSupabaseClient } from "@/utils/supabase/client-server";
import { auth, clerkClient } from "@clerk/nextjs/server";

export type FormState = {
  error?: string;
};

export async function submitTalentApplication(
  initialState: FormState,
  formData: FormData,
): Promise<FormState> {
  console.log("Received talent application data:", formData);

  // STEP 1: Validate form data
  const validatedData = talentApplicationSchema.safeParse({
    full_name: formData.get("fullName"),
    email: formData.get("email"),
    location: formData.get("location"),
    linkedin_url: formData.get("linkedinUrl"),
    current_stage: formData.get("experienceLevel"),
    phone_number: formData.get("phoneNumber"),
    cvFileKey: formData.get("cvFileKey"),
  });

  if (!validatedData.success) {
    return {
      error: validatedData.error.issues[0].message,
    };
  }

  // STEP 2: Upload data to supabase
  const { userId } = await auth();
  if (!userId) return { error: "User not authenticated" };

  const supabase = await createServerSupabaseClient();

  // update profile information
  const { error: profileError } = await supabase.from("profiles").upsert({
    id: userId,
    full_name: validatedData.data.full_name,
    email: validatedData.data.email,
    role: "talent",
    status: "in_review",
  });

  // insert talent
  const { error: talentError } = await supabase.from("talents").upsert({
    user_id: userId,
    location: validatedData.data.location,
    current_stage: validatedData.data.current_stage,
    linkedin_url: validatedData.data.linkedin_url,
    cv_file_key: validatedData.data.cvFileKey,
  });

  if (talentError || profileError) {
    console.error("Supabase error:", talentError || profileError);
    return {
      error: "Failed to submit application. Please try again.",
    };
  }

  // update clerk metadata to review status
  try {
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        app_role: "talent",
        app_status: "in_review",
      },
    });
    console.log("Clerk metadata updated successfully");
  } catch (clerkError) {
    console.error("Clerk metadata update error:", clerkError);
  }
  return {};
}
