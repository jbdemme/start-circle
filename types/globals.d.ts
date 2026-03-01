export {};

declare global {
  interface CustomJwtSessionClaims {
    app_status?: "application" | "in_review" | "accepted" | "rejected";
    app_role?: "talent" | "startup";
  }
}
