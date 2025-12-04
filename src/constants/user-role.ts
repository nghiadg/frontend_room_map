import { Role } from "@/types/role";

// Role name constants for UI
export const USER_ROLE = {
  RENTER: "renter",
  LESSOR: "lessor",
} as const;

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

// Helper to get role ID from role name using fetched roles
export const getRoleId = (
  roles: Role[],
  roleName: string
): number | undefined => {
  return roles.find((role) => role.name === roleName)?.id;
};

// Helper to get role name from role ID using fetched roles
export const getRoleName = (
  roles: Role[],
  roleId: number
): string | undefined => {
  return roles.find((role) => role.id === roleId)?.name;
};
