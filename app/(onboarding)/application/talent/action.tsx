"use server";

import { talentApplicationSchema } from "@/lib/schema";

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

  return { message: "Application submitted successfully!" };
}
