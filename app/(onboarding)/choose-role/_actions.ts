"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

export const setRole = async (
  formData: FormData,
): Promise<{
  message?: UserPublicMetadata;
  error?: string;
}> => {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated) {
    return { error: "No signed-in user" };
  }

  const client = await clerkClient();

  try {
    const res = await client.users.updateUser(userId, {
      publicMetadata: {
        app_role: formData.get("role"),
        app_status: "application",
      },
    });
    return { message: res.publicMetadata as UserPublicMetadata };
  } catch {
    return {
      error: `There was an error updating the user metadata to the role.`,
    };
  }
};
