export {};

export type Roles = "admin" | "seller" | "buyer";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles;
    };
  }
}
