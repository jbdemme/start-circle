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
      status: "testing_status",
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

  return { message: "Application submitted successfully!" };
}
