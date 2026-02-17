import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * 1. Exclude specific public paths: /, /about, /legal
     * 2. Exclude static files and images
     */
    "/dashboard",
  ],
};
