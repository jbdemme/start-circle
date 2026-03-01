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
  abilities: Record<string, unknown> | null;
  location: string | null;
  current_stage: string | null;
  availability: string[] | null;
  cv_file_key: string | null;
  specializations: string[] | null;
  linkedin_url: string | null;
  relocate: boolean | null;
  description: string | null;
  accept_terms: boolean | null;
  accept_privacy: boolean | null;
  accept_data_sharing: boolean | null;
  profiles: {
    id: string;
    full_name: string;
    email: string | null;
    role: string;
    status: string;
    created_at: string;
    updated_at: string | null;
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
      abilities,
      location,
      current_stage,
      availability,
      cv_file_key,
      specializations,
      linkedin_url,
      relocate,
      description,
      accept_terms,
      accept_privacy,
      accept_data_sharing,
      profiles!talents_user_id_fkey (
        id,
        full_name,
        email,
        role,
        status,
        created_at,
        updated_at
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
        full_name: talent.full_name,
        role: talent.role,
        status: talent.status,
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
      ...talent,
      email: validateEmail(talent.email),
      current_stage: validateCurrentStage(talent.current_stage),
      availability: validateAvailability(talent.availability),
    }));
}

/**
 * Transform a database row to a TalentWithProfile object.
 */
function transformTalentRow(row: TalentWithProfileRow): TalentWithProfile {
  const profile = row.profiles;

  return {
    full_name: profile?.full_name ?? "Unknown",
    email: profile?.email ?? null,
    role: profile?.role ?? "talent",
    status: profile?.status ?? "in_review",
    created_at: profile?.created_at
      ? new Date(profile.created_at)
      : new Date(),
    updated_at: profile?.updated_at ? new Date(profile.updated_at) : null,
    abilities: row.abilities,
    location: row.location,
    current_stage: row.current_stage as TalentWithProfile["current_stage"],
    availability: row.availability as TalentWithProfile["availability"],
    cv_file_key: row.cv_file_key,
    specializations: row.specializations,
    linkedin_url: row.linkedin_url,
    relocate: row.relocate,
    description: row.description,
    accept_terms: row.accept_terms,
    accept_privacy: row.accept_privacy,
    accept_data_sharing: row.accept_data_sharing,
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
