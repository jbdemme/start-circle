import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

export async function createServerSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      async accessToken() {
        const { getToken } = await auth();
        const token = await getToken();
        console.log(
          "Clerk token:",
          token ? `${token.substring(0, 50)}...` : "null",
        );
        if (token) {
          // Decode to see claims
          const decoded = JSON.parse(
            Buffer.from(token.split(".")[1], "base64").toString(),
          );
          console.log("Token claims:", decoded);
        }
        return token ?? null;
      },
    },
  );
}
