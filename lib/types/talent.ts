// ============================================
// TALENT TYPES - ZOD SCHEMAS & TYPE INFERENCE
// ============================================

import { z } from "zod";
import { Speciality, SPECIALITY_LABELS, SpecialitySchema } from "./general";
import { JOB_TYPE_LABELS, JobType, JobTypeSchema } from "./job";

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

// --- DB SCHEMAS ---

export const TalentRowSchema = z.object({
  user_id: z.string().uuid(),
  type: SpecialitySchema.array().nullable(),
  abilities: z.record(z.unknown()).nullable(),
  location: z.string().nullable(),
  cv_url: z.string().nullable(),
  current_stage: CurrentStageSchema.nullable(),
  availability: z.array(JobTypeSchema).nullable(),
});

// --- LABEL MAPPINGS (for display) ---

export const CURRENT_STAGE_LABELS: Record<CurrentStage, string> = {
  bachelor: "Bachelor Student",
  master: "Master Student",
  "early-career": "Early Career",
  "experienced-professional": "Experienced Professional",
};

// --- TYPE EXPORTS (inferred from schemas) ---

export type CurrentStage = z.infer<typeof CurrentStageSchema>;
export type TalentRow = z.infer<typeof TalentRowSchema>;

// --- HELPER FUNCTIONS ---

export function getTypeLabel(type: string): string {
  if (!type) return "—";
  return SPECIALITY_LABELS[type as Speciality] ?? type;
}

export function getCurrentStageLabel(stage: string | null): string {
  if (!stage) return "—";
  return CURRENT_STAGE_LABELS[stage as CurrentStage] ?? stage;
}

export function getAvailabilityLabel(availability: string): string {
  if (!availability) return "—";
  return JOB_TYPE_LABELS[availability as JobType] ?? availability;
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
