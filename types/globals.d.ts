export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      status: "application" | "in_review" | "accepted" | "rejected";
      role: "talent" | "startup";
    };
  }
}
