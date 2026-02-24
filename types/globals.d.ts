export {};

declare global {
  interface CustomJwtSessionClaims {
    status?: "application" | "in_review" | "accepted" | "rejected";
    role?: "talent" | "startup";
  }
}
