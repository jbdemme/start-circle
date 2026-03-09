"use server";

import { StartupApplicationSchema } from "@/lib/schema/startup";

export type FormState = {
  error: string;
};

export async function submitStartupApplication(
  initialState: FormState,
  formData: FormData,
) {
  const validatedData = StartupApplicationSchema.safeParse({
    startupName: formData.get("startupName"),
    website: formData.get("website"),
    description: formData.get("description"),
  });

  if (!validatedData.success) {
    return { error: validatedData.error.issues[0].message };
  }

  return { error: "" };
}
