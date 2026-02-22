// ============================================
// TALENT TYPES - ZOD SCHEMAS & TYPE INFERENCE
// ============================================

import { z } from "zod";

// --- SCHEMAS ---

/**
 * Current stage of the talent's career/education
 */
export const CurrentStageSchema = z.enum([
  "bachelor",
  "master",
  "early-career",
  "experienced-professional",
]);

/**
 * Availability types - matches job types for compatibility
 * Talent can select multiple options
 */
export const AvailabilityTypeSchema = z.enum([
  "full-time",
  "internship",
  "part-time-working-student",
]);

// --- LABEL MAPPINGS (for display) ---

export const CURRENT_STAGE_LABELS: Record<CurrentStage, string> = {
  bachelor: "Bachelor Student",
  master: "Master Student",
  "early-career": "Early Career",
  "experienced-professional": "Experienced Professional",
};

export const AVAILABILITY_TYPE_LABELS: Record<AvailabilityType, string> = {
  "full-time": "Full-time",
  internship: "Internship",
  "part-time-working-student": "Part-time / Working student",
};

// --- TYPE EXPORTS (inferred from schemas) ---

export type CurrentStage = z.infer<typeof CurrentStageSchema>;
export type AvailabilityType = z.infer<typeof AvailabilityTypeSchema>;

// --- DATABASE ROW SCHEMA ---

/**
 * Schema for the raw database row from Supabase talents table
 */
export const TalentRowSchema = z.object({
  user_id: z.string(),
  type: z.string().nullable(),
  abilities: z.record(z.unknown()).nullable(),
  location: z.string().nullable(),
  current_stage: CurrentStageSchema.nullable(),
  availability: z.array(AvailabilityTypeSchema).nullable(),
  cv_url: z.string().nullable(), // Lenient: accept any string
});

export type TalentRow = z.infer<typeof TalentRowSchema>;

// --- PROFILE SCHEMA ---

/**
 * Schema for profile data joined from profiles table
 */
export const TalentProfileSchema = z.object({
  id: z.string(),
  full_name: z.string(),
  email: z.string().email().nullable(),
  role: z.string(),
  status: z.string(),
});

export type TalentProfile = z.infer<typeof TalentProfileSchema>;

// --- COMBINED TYPE FOR DISPLAY ---

/**
 * Schema for MANDATORY fields only.
 * If these fail validation, the talent is excluded entirely.
 */
export const TalentWithProfileMandatorySchema = z.object({
  userId: z.string().min(1),
  fullName: z.string().min(1),
  role: z.string(),
  profileStatus: z.string(),
});

/**
 * Schema for OPTIONAL fields with strict validation.
 * If these fail, they fallback to null (talent is still shown).
 */
export const TalentWithProfileOptionalSchema = z.object({
  email: z.string().email().nullable(),
  type: z.string().nullable(),
  abilities: z.record(z.unknown()).nullable(),
  location: z.string().nullable(),
  currentStage: CurrentStageSchema.nullable(),
  availability: z.array(AvailabilityTypeSchema).nullable(),
  cvUrl: z.string().url().nullable().or(z.literal("")),
});

/**
 * Full schema for talent with profile data (for display).
 * Used for type inference only - validation is done in two phases.
 */
export const TalentWithProfileSchema = z.object({
  userId: z.string(),
  fullName: z.string(),
  email: z.string().email().nullable(),
  role: z.string(),
  profileStatus: z.string(),
  type: z.string().nullable(),
  abilities: z.record(z.unknown()).nullable(),
  location: z.string().nullable(),
  currentStage: CurrentStageSchema.nullable(),
  availability: z.array(AvailabilityTypeSchema).nullable(),
  cvUrl: z.string().nullable(),
});

export type TalentWithProfile = z.infer<typeof TalentWithProfileSchema>;

// --- HELPER FUNCTIONS ---

export function getCurrentStageLabel(stage: string | null): string {
  if (!stage) return "—";
  return CURRENT_STAGE_LABELS[stage as CurrentStage] ?? stage;
}

export function getAvailabilityLabel(type: string): string {
  return AVAILABILITY_TYPE_LABELS[type as AvailabilityType] ?? type;
}

/**
 * Get availability labels as an array of strings
 */
export function getAvailabilityLabels(availability: string[] | null): string[] {
  if (!availability || availability.length === 0) return [];
  return availability.map(getAvailabilityLabel);
}

/**
 * Get initials from a full name
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Extract skills/abilities as an array of strings
 */
export function extractSkills(
  abilities: Record<string, unknown> | null,
): string[] {
  if (!abilities) return [];

  // Handle different possible structures of abilities
  if (Array.isArray(abilities.skills)) {
    return abilities.skills.filter(
      (skill): skill is string => typeof skill === "string",
    );
  }

  if (Array.isArray(abilities)) {
    return abilities.filter(
      (skill): skill is string => typeof skill === "string",
    );
  }

  // If abilities is an object with skill keys
  const keys = Object.keys(abilities);
  if (keys.length > 0) {
    return keys.slice(0, 5); // Return first 5 keys as skills
  }

  return [];
}

/**
 * Validate and parse a talent with profile data.
 * Returns the parsed data or throws a ZodError.
 */
export function parseTalentWithProfile(data: unknown): TalentWithProfile {
  return TalentWithProfileSchema.parse(data);
}

/**
 * Safely parse talent with profile data, returning null if invalid.
 */
export function safeParseTalentWithProfile(
  data: unknown,
): TalentWithProfile | null {
  const result = TalentWithProfileSchema.safeParse(data);
  return result.success ? result.data : null;
}
