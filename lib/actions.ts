"use server";
import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";

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

export async function signUpNewUserr(formData: FormData) {
  const { email, password, fullName, role } = {
    email: formData.get("email")?.toString(),
    password: formData.get("password")?.toString(),
    fullName: formData.get("fullName")?.toString(),
    role: formData.get("role")?.toString(),
  };

  const supabase = await createClient();

  if (!email || !password || !fullName || !role) {
    console.log("missing field");
    return;
  }
  console.log(email, password, fullName, role);

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role,
      },
    },
  });

  if (error) {
    console.log("SUPABASE ERROR:");
    console.log(error.message);
  } else {
    console.log("successfully created new user");
  }

  redirect("/login");
}

export async function logInAction(formData: FormData) {
  const { email, password } = {
    email: formData.get("email")?.toString(),
    password: formData.get("password")?.toString(),
  };

  const supabase = await createClient();

  if (!email || !password) {
    console.log("missing field");
    return;
  }
  console.log(email, password);

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.log("SUPABASE ERROR:");
    console.log(error.message);
  } else {
    console.log("successfully created new user");
  }

  redirect("/dashboard");
}

export async function signOutAction() {
  const supabase = await createClient();

  await supabase.auth.signOut();
}

export async function newJob(user_id: string, formData: FormData) {
  const { title, description, location } = {
    title: formData.get("title")?.toString(),
    description: formData.get("description")?.toString(),
    location: formData.get("location")?.toString(),
  };

  const supabase = await createClient();

  console.log("FORM:");
  console.log(title, description, location);

  console.log("USER ID:");
  console.log(user_id);

  const newJobEntry = {
    startup_id: user_id,
    title,
    description,
    location,
    status: "draft",
  };

  console.log(newJobEntry);

  await supabase.from("jobs").insert(newJobEntry);
}
