import { createClient } from "@/lib/supabase/server";

export type UserRole = "startup" | "talent";
export type UserStatus = "in_review" | "accepted" | "rejected";

export interface UserClaims {
  role: UserRole;
  status: UserStatus;
}

/**
 * Get the current user's role and status from JWT claims
 * This is efficient because the data is embedded in the JWT token
 * and doesn't require a database query
 *
 * Note: Checks both app_metadata (preferred, set via Admin API) and
 * user_metadata (fallback, set at signup)
 */
export async function getUserClaims(): Promise<UserClaims | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Check both app_metadata (preferred) and user_metadata (fallback)
  // app_metadata is set via Admin API and is more secure
  // user_metadata is set at signup and can be modified by the user
  const role =
    (user.app_metadata?.role as UserRole) ||
    (user.user_metadata?.role as UserRole) ||
    "talent";
  const status = (user.app_metadata?.status as UserStatus) || "in_review";

  return { role, status };
}

/**
 * Get the current user's role from JWT claims
 */
export async function getUserRole(): Promise<UserRole | null> {
  const claims = await getUserClaims();
  return claims?.role ?? null;
}

/**
 * Get the current user's status from JWT claims
 */
export async function getUserStatus(): Promise<UserStatus | null> {
  const claims = await getUserClaims();
  return claims?.status ?? null;
}

/**
 * Check if the current user has a specific role
 */
export async function hasRole(requiredRole: UserRole): Promise<boolean> {
  const claims = await getUserClaims();
  return claims?.role === requiredRole;
}

/**
 * Check if the current user is accepted (has full platform access)
 */
export async function isAccepted(): Promise<boolean> {
  const claims = await getUserClaims();
  return claims?.status === "accepted";
}

/**
 * Check if the current user can access the platform
 * User must be accepted to have full access
 */
export async function canAccessPlatform(): Promise<boolean> {
  const claims = await getUserClaims();
  return claims?.status === "accepted";
}

/**
 * Get the dashboard path for the current user based on their role
 */
export async function getDashboardPath(): Promise<string> {
  const claims = await getUserClaims();
  return `/${claims?.role || "talent"}/dashboard`;
}
