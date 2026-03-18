"use server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  talentApplicationSchema,
  type TalentApplicationFormData,
} from "@/lib/schema/talent";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/utils/supabase/client-server";

const S3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function getPresignedUrl(fileName: string, contentType: string) {
  const key = `${Date.now()}-${fileName}`; // Unique filename
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  const signedUrl = await getSignedUrl(S3, command, { expiresIn: 3600 });

  console.log("Generated presigned URL:", signedUrl);
  console.log("File key:", key);

  return { signedUrl, key };
}

export async function submitTalentApplication(
  formData: TalentApplicationFormData,
  cvKey: string,
): Promise<{ success: boolean; error?: string; applicationId?: string }> {
  try {
    // Get authenticated user
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return {
        success: false,
        error: "You must be logged in to submit an application",
      };
    }

    const validatedData = talentApplicationSchema.parse(formData);

    // Initialize Supabase client
    const supabase = await createServerSupabaseClient();

    // First, update/insert profile information
    const { error: profileError } = await supabase.from("profiles").upsert(
      {
        id: clerkUserId,
        full_name: validatedData.full_name,
        email: validatedData.email,
        role: "talent",
        status: "in_review",
      },
      { onConflict: "id" }, // Use id as the unique key, not email
    );

    if (profileError) {
      console.error("Profile error:", profileError);
      return {
        success: false,
        error: "Failed to save profile information.",
      };
    }

    // Then, insert talent-specific information
    const { data, error: talentError } = await supabase
      .from("talents")
      .upsert({
        user_id: clerkUserId,
        location: validatedData.location,
        cv_file_key: cvKey,
      })
      .select("user_id")
      .single();

    if (talentError) {
      console.error("Talent error:", talentError);
      return {
        success: false,
        error: "Failed to submit application. Please try again.",
      };
    }

    // Update Clerk metadata to reflect application submission
    try {
      console.log("Updating Clerk metadata after application");
      const client = await clerkClient();
      await client.users.updateUser(clerkUserId, {
        publicMetadata: {
          app_role: "talent",
          app_status: "in_review",
        },
      });
      console.log("Clerk metadata updated successfully");
    } catch (metadataError) {
      console.error("Metadata update error:", metadataError);
      // Don't fail the entire submission if metadata update fails
      // The application is already saved in the database
    }

    return { success: true, applicationId: data?.user_id };
  } catch (error) {
    console.error("Submission error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "An unexpected error occurred" };
  }
}
