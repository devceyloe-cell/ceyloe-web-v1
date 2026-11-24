export const ADMIN_ROLES = ["owner", "staff"] as const;

export type AdminRole = (typeof ADMIN_ROLES)[number];

export function isAdminRole(value: unknown): value is AdminRole {
  return value === "owner" || value === "staff";
}

export function normalizeAdminRole(value: unknown, fallback: AdminRole = "owner"): AdminRole {
  return isAdminRole(value) ? value : fallback;
}

export function formatAdminRole(role: string): string {
  switch (role) {
    case "owner":
      return "Owner";
    case "staff":
      return "Staff";
    case "admin":
      return "Administrator";
    default:
      return role.charAt(0).toUpperCase() + role.slice(1);
  }
}
