"use server";

import { talentApplicationSchema } from "@/lib/schema";
import { createServerSupabaseClient } from "@/utils/supabase/client-server";
import { auth } from "@clerk/nextjs/server";

export type FormState = {
  message: string;
  errors?: {
    upload?: string[];
    full_name?: string[];
    email?: string[];
    location?: string[];
    linkedin_url?: string[];
    current_stage?: string[];
    phone_number?: string[];
  };
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
  });

  if (!validatedData.success) {
    return {
      message: "",
      errors: validatedData.error.flatten().fieldErrors,
    };
  }

  // STEP 2: Upload data to supabase
  const { userId } = await auth();
  if (!userId)
    return { message: "", errors: { upload: ["User not authenticated"] } };

  const supabase = await createServerSupabaseClient();

  console.log("userId:", userId);

  // update profile information
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      full_name: validatedData.data.full_name,
      email: validatedData.data.email,
      role: "talent",
      status: "in_review",
    })
    .eq("id", userId);

  if (profileError) {
    console.error("Profile update error:", profileError);
    return {
      message: "",
      errors: {
        upload: ["Failed to save name and/or email. Please try again."],
      },
    };
  }

  // insert talent
  const { error: talentError } = await supabase.from("talents").insert({
    user_id: userId,
    location: validatedData.data.location,
    current_stage: validatedData.data.current_stage,
    linkedin_url: validatedData.data.linkedin_url,
  });

  if (talentError) {
    console.error("Talent insert error:", talentError);
    return {
      message: "",
      errors: {
        upload: ["Failed to submit application. Please try again."],
      },
    };
  }

  return { message: "Application submitted successfully!" };
}
