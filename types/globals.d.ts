import { ApplicationStatus, Role } from "@/lib/schema";

export {};

declare global {
  interface CustomJwtSessionClaims {
    app_status?: ApplicationStatus;
    app_role?: Role;
  }
}
