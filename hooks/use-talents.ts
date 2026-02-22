"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { talentKeys } from "@/lib/queries/keys";
import {
  TalentWithProfileMandatorySchema,
  CurrentStageSchema,
  AvailabilityTypeSchema,
  type TalentWithProfile,
  type AvailabilityType,
  type CurrentStage,
} from "@/lib/types/talent";

/**
 * Raw database response type for talents with joined profile
 * (Supabase returns loose types, we validate with Zod)
 */
interface TalentWithProfileRow {
  user_id: string;
  type: string | null;
  abilities: Record<string, unknown> | null;
  location: string | null;
  current_stage: string | null;
  availability: string[] | null;
  cv_url: string | null;
  profiles: {
    id: string;
    full_name: string;
    email: string | null;
    role: string;
    status: string;
  } | null;
}

/**
 * Validate email format
 */
function validateEmail(email: string | null): string | null {
  if (!email) return null;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.warn(
      `Invalid optional field "email":`,
      email,
      "- falling back to null",
    );
    return null;
  }
  return email;
}

/**
 * Validate URL format
 */
function validateUrl(url: string | null): string | null {
  if (!url) return null;
  try {
    new URL(url);
    return url;
  } catch {
    console.warn(
      `Invalid optional field "cvUrl":`,
      url,
      "- falling back to null",
    );
    return null;
  }
}

/**
 * Validate current stage
 */
function validateCurrentStage(stage: string | null): CurrentStage | null {
  if (!stage) return null;
  const result = CurrentStageSchema.safeParse(stage);
  if (!result.success) {
    console.warn(
      `Invalid optional field "currentStage":`,
      stage,
      "- falling back to null",
    );
    return null;
  }
  return result.data;
}

/**
 * Validate availability array
 */
function validateAvailability(
  availability: string[] | null,
): AvailabilityType[] | null {
  if (!availability || availability.length === 0) return null;
  const validItems: AvailabilityType[] = [];
  for (const item of availability) {
    const result = AvailabilityTypeSchema.safeParse(item);
    if (result.success) {
      validItems.push(result.data);
    } else {
      console.warn(`Invalid availability item:`, item, "- skipping");
    }
  }
  return validItems.length > 0 ? validItems : null;
}

/**
 * Fetch all talents with their profile data from Supabase.
 * Joins talents table with profiles table.
 * Validates data with Zod for runtime safety.
 */
async function fetchTalents(): Promise<TalentWithProfile[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("talents")
    .select(
      `
      user_id,
      type,
      abilities,
      location,
      current_stage,
      availability,
      cv_url,
      profiles!talents_user_id_fkey (
        id,
        full_name,
        email,
        role,
        status
      )
    `,
    )
    .order("user_id");

  if (error) {
    throw new Error(error.message);
  }

  // Two-phase validation:
  // 1. Check mandatory fields - if fail, exclude the talent
  // 2. Validate each optional field individually - if fail, fallback to null for that field only
  return (data as unknown as TalentWithProfileRow[])
    .map(transformTalentRow)
    .filter((talent): talent is TalentWithProfile => {
      // Phase 1: Validate mandatory fields only
      const mandatoryResult = TalentWithProfileMandatorySchema.safeParse({
        userId: talent.userId,
        fullName: talent.fullName,
        role: talent.role,
        profileStatus: talent.profileStatus,
      });

      if (!mandatoryResult.success) {
        console.warn(
          "Talent excluded - invalid mandatory fields:",
          mandatoryResult.error.errors,
        );
        return false;
      }

      return true;
    })
    .map((talent) => ({
      // Mandatory fields (already validated)
      userId: talent.userId,
      fullName: talent.fullName,
      role: talent.role,
      profileStatus: talent.profileStatus,
      // Optional fields (validated individually, fallback to null)
      email: validateEmail(talent.email),
      type: talent.type, // string, no special validation
      abilities: talent.abilities, // JSON, no special validation
      location: talent.location, // string, no special validation
      currentStage: validateCurrentStage(talent.currentStage),
      availability: validateAvailability(talent.availability),
      cvUrl: validateUrl(talent.cvUrl),
    }));
}

/**
 * Transform a database row to a TalentWithProfile object.
 */
function transformTalentRow(row: TalentWithProfileRow): TalentWithProfile {
  const profile = row.profiles;

  return {
    userId: row.user_id,
    fullName: profile?.full_name ?? "Unknown",
    email: profile?.email ?? null,
    role: profile?.role ?? "Talent",
    profileStatus: profile?.status ?? "unknown",
    type: row.type,
    abilities: row.abilities,
    location: row.location,
    currentStage: row.current_stage as TalentWithProfile["currentStage"],
    availability: row.availability as TalentWithProfile["availability"],
    cvUrl: row.cv_url,
  };
}

/**
 * Hook to fetch all talents with their profile data.
 *
 * @example
 * ```tsx
 * const { data: talents, isLoading, error } = useTalents();
 * ```
 */
export function useTalents() {
  return useQuery({
    queryKey: talentKeys.lists(),
    queryFn: fetchTalents,
  });
}

/**
 * Hook to invalidate talents cache.
 * Use this after creating, updating, or deleting talents.
 *
 * @example
 * ```tsx
 * const invalidateTalents = useInvalidateTalents();
 * await invalidateTalents();
 * ```
 */
export function useInvalidateTalents() {
  const queryClient = useQueryClient();

  return () =>
    queryClient.invalidateQueries({
      queryKey: talentKeys.lists(),
    });
}
