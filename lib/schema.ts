import * as z from "zod";
import { DEPARTMENT, JOB_TYPE } from "./types/job";

export const newJobSchema = z.object({
  title: z
    .string()
    .min(5, "Job title must be at least 5 characters")
    .max(80, "Job title must be less than 80 characters"),
  description: z
    .string()
    .max(5000, "Description must be less than 5000 characters"),
  location: z.string().max(50, "Location must be less than 50 characters"),
  department: z.enum([
    DEPARTMENT.GENERALIST,
    DEPARTMENT.TECH,
    DEPARTMENT.SALES_GTM,
    DEPARTMENT.OPERATIONS,
    DEPARTMENT.FINANCE,
    DEPARTMENT.PEOPLE_HR,
    DEPARTMENT.GROWTH_MARKETING,
    DEPARTMENT.PRODUCT,
    DEPARTMENT.OTHER,
  ]),
  jobType: z.enum([
    JOB_TYPE.FULL_TIME,
    JOB_TYPE.INTERNSHIP,
    JOB_TYPE.PART_TIME_WORKING_STUDENT,
  ]),
});

export type NewJobFormData = z.infer<typeof newJobSchema>;
