"use server";
import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";
import { UNSTABLE_REVALIDATE_RENAME_ERROR } from "next/dist/lib/constants";

export type ActionState = {
  success?: string;
  error?: string;
} | null;

export async function signUpNewUser(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "All fields are required." };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 8 characters." };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: "Check your email to confirm your account!" };
}

export async function loginNewUser(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();

  console.log("test2");

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  console.log(email, password);

  if (!email || !password) {
    return { error: "All fields are required." };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}
