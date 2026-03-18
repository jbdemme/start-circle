"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "./supabase/server";
import { type JobFormData } from "./schema/job";
import { RoleSchema } from "./schema/general";

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
  const payload = {
    email: formData.get("email"),
    role: formData.get("role"),
  };

  const parsed = WaitlistSchema.safeParse(payload);
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

  // Redirect based on user role from app_metadata
  const role = data.user?.app_metadata?.role || "talent";
  redirect(`/${role}/dashboard`);
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

  // Sign up with role in app_metadata (this is the correct way for Supabase Cloud)
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role, // This goes into user_metadata, but we need it in app_metadata
      },
    },
  });

  if (error) {
    console.log("SUPABASE ERROR:");
    console.log(error.message);
  } else {
    console.log("successfully created new user");
    // Note: For Supabase Cloud, you'll need to manually set app_metadata
    // via the Admin API or Dashboard to make role available in JWT
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
    console.log("successfully logged in user");
  }

  // Redirect based on user role from app_metadata
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const role = user?.app_metadata?.role || "talent";
  redirect(`/${role}/dashboard`);
}

export async function signOutAction() {
  const supabase = await createClient();

  await supabase.auth.signOut();
}

export async function createJob(
  startupId: string,
  data: JobFormData,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase.from("jobs").insert({
    startup_id: startupId,
    title: data.title,
    description: data.description,
    location: data.location,
    department: data.department,
    job_type: data.job_type,
    status: "draft",
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/jobs");
  return { success: true };
}

export async function updateJobStatus(
  jobId: string,
  status: "draft" | "active" | "paused" | "expired",
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("jobs")
    .update({ status })
    .eq("id", jobId)
    .select();

  if (error || !data || data.length === 0) {
    console.log("ERROR:");
    console.log(error);
    return { success: false, error: error?.message || "Job not found" };
  }

  console.log("NO ERROR!");
  revalidatePath("/dashboard/jobs");
  return { success: true };
}

/**
 * @deprecated Use updateJobStatus instead
 */
export async function publishJob(
  jobId: string,
): Promise<{ success: boolean; error?: string }> {
  return updateJobStatus(jobId, "active");
}

export async function updateJob(
  jobId: string,
  data: JobFormData,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("jobs")
    .update({
      title: data.title,
      description: data.description,
      location: data.location,
      department: data.department,
      job_type: data.job_type,
      updated_at: new Date().toISOString(),
    })
    .eq("id", jobId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/jobs");
  return { success: true };
}

/**
 * @deprecated Use createJob instead
 */
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
