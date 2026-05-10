export const AUTH_MODULE = {
  controller: "auth",
} as const;

export enum AuthUserRole {
  OWNER = "OWNER",
  ADMIN = "ADMIN",
  STAFF = "STAFF",
}
