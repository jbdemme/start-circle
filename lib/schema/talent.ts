import { z } from "zod";
import {
  WorkTypeSchema,
  WORK_TYPE_LABELS,
  type WorkType,
  Speciality,
  SpecialitySchema,
  SPECIALITY_LABELS,
  ProfileSchema,
  getLabel,
} from "./general";

export const CurrentStageSchema = z.enum([
  "bachelor",
  "master",
  "early-career",
  "experienced-professional",
]);

export const CURRENT_STAGE_LABELS: Record<CurrentStage, string> = {
  bachelor: "Bachelor Student",
  master: "Master Student",
  "early-career": "Early Career",
  "experienced-professional": "Experienced Professional",
};

export const AvailabilityTypeSchema = WorkTypeSchema;
export type AvailabilityType = WorkType;
export const AVAILABILITY_TYPE_LABELS = WORK_TYPE_LABELS;

// Base talent row (as returned from Supabase queries)
export const TalentRowSchema = z.object({
  user_id: z.string().uuid(),
  specializations: z.array(SpecialitySchema).nullable(),
  abilities: z.record(z.unknown()).nullable(),
  location: z.string().nullable(),
  current_stage: CurrentStageSchema.nullable(),
  availability: z.array(AvailabilityTypeSchema).nullable(),
  cv_file_key: z.string().nullable(),
  linkedin_url: z.string().url().nullable(),
  relocate: z.boolean().nullable(),
  description: z.string().nullable(),
  accept_terms: z.boolean().nullable(),
  accept_privacy: z.boolean().nullable(),
  accept_data_sharing: z.boolean().nullable(),
});
export type TalentRow = z.infer<typeof TalentRowSchema>;

// Joined talent + profile shape used by UI
export const TalentWithProfileSchema = TalentRowSchema.merge(
  ProfileSchema.omit({ id: true }),
);
export type TalentWithProfile = z.infer<typeof TalentWithProfileSchema>;
export const TalentWithProfileMandatorySchema = TalentWithProfileSchema.pick({
  full_name: true,
  role: true,
  status: true,
});

// Talent application form schema is a pick of the joined shape
export const talentApplicationSchema = z.object({
  full_name: z.string().min(2).max(100),
  email: z.string().email("Invalid email address"),
  location: z.string().max(100).optional(),
  current_stage: CurrentStageSchema,
  specializations: z.array(SpecialitySchema).optional(),
  linkedin_url: z.string().url().optional(),
  relocate: z.boolean(),
  description: z.string().max(1000).optional(),
  accept_terms: z.boolean({
    message: "You must accept the terms and conditions",
  }),
  accept_privacy: z.boolean({ message: "You must accept the privacy policy" }),
  accept_data_sharing: z.boolean({ message: "You must accept data sharing" }),
});
export type TalentApplicationFormData = z.infer<typeof talentApplicationSchema>;

export type CurrentStage = z.infer<typeof CurrentStageSchema>;

export function getTypeLabel(type: string): string {
  return getLabel(type as Speciality | null, SPECIALITY_LABELS);
}

export function getCurrentStageLabel(stage: string | null): string {
  return getLabel(stage as CurrentStage | null, CURRENT_STAGE_LABELS);
}

export function getAvailabilityLabel(availability: string): string {
  return getLabel(availability as WorkType | null, WORK_TYPE_LABELS);
}

export function getAvailabilityLabels(
  availability: WorkType[] | null | undefined,
): string[] {
  if (!availability || availability.length === 0) return [];
  return availability.map((item) => getAvailabilityLabel(item));
}

export function extractSkills(abilities: Record<string, unknown> | null) {
  if (!abilities) return [] as string[];
  return Object.keys(abilities);
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
