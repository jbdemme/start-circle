import { z } from "zod";

// --- SCHEMAS ---

export const RoleSchema = z.enum(["talent", "startup"]);

export const ApplicationStatusSchema = z.enum([
  "new",
  "application",
  "in_review",
  "accepted",
  "rejected",
]);

/**
 * Specialty schema: For Department and Talent Type
 */
export const SpecialitySchema = z.enum([
  "generalist",
  "tech",
  "sales-gtm",
  "operations",
  "finance",
  "people-hr",
  "growth-marketing",
  "product",
  "other",
]);

// --- DB SCHEMAS ---

export const profileRowSchema = z.object({
  id: z.string().uuid(),
  created_at: z.coerce.date(),
  role: RoleSchema,
  status: ApplicationStatusSchema,
  updated_at: z.coerce.date().nullable(),
  email: z.string().email().nullable(),
  full_name: z.string(),
});

// --- LABEL MAPPINGS (for display) ---

export const SPECIALITY_LABELS: Record<Speciality, string> = {
  generalist: "Generalist",
  tech: "Tech",
  "sales-gtm": "Sales/GTM",
  operations: "Operations",
  finance: "Finance",
  "people-hr": "People/HR",
  "growth-marketing": "Growth/Marketing",
  product: "Product",
  other: "Other",
};

// --- TYPE EXPORTS (inferred from schemas) ---

export type Speciality = z.infer<typeof SpecialitySchema>;
export type Role = z.infer<typeof RoleSchema>;
export type ApplicationStatus = z.infer<typeof ApplicationStatusSchema>;
