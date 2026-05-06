"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { RoleSchema } from "@/lib/schema/general";

export type ActionState = {
  success?: string;
  error?: string;
} | null;

const WaitlistSchema = z.object({
  email: z.string().email(),
  role: RoleSchema,
});

export async function joinWaitlist(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {

  console.log("TESTING");

  const parsed = WaitlistSchema.safeParse({
    email: formData.get("email"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return { error: "Enter a valid email and select a role." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("waitlist").insert({
    email: parsed.data.email,
    role: parsed.data.role,
  });

  if (error) {
    if (error.code === "23505") {
      return { success: "You're already on the waitlist." };
    }
    return { error: "Unable to join the waitlist right now." };
  }

  return { success: "You're on the list. We'll be in touch soon." };
}