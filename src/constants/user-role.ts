import { Role } from "@/types/role";

// Role name constants for UI
export const USER_ROLE = {
  RENTER: "renter",
  LESSOR: "lessor",
  ADMIN: "admin",
} as const;

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

// =============================================================================
// PERMISSION SYSTEM
// =============================================================================

export const PERMISSIONS = {
  CREATE_POST: "create_post",
  EDIT_POST: "edit_post",
  DELETE_POST: "delete_post",
  MARK_AS_RENTED: "mark_as_rented",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// Role-Permission mapping: defines which roles have which permissions
export const ROLE_PERMISSIONS: Record<UserRole, readonly Permission[]> = {
  [USER_ROLE.ADMIN]: [PERMISSIONS.CREATE_POST],
  [USER_ROLE.LESSOR]: [
    PERMISSIONS.CREATE_POST,
    PERMISSIONS.EDIT_POST,
    PERMISSIONS.DELETE_POST,
    PERMISSIONS.MARK_AS_RENTED,
  ],
  [USER_ROLE.RENTER]: [],
} as const;

// Protected routes configuration: maps route patterns to required permissions
export const PROTECTED_ROUTES: Record<string, Permission[]> = {
  "/posts/create": [PERMISSIONS.CREATE_POST],
  "/posts/edit": [PERMISSIONS.EDIT_POST],
  "/account/posts": [PERMISSIONS.EDIT_POST], // Only lessor can manage their posts
} as const;

// Routes that only require authentication (no specific permissions)
// Any logged-in user can access these routes
export const AUTH_REQUIRED_ROUTES: string[] = [
  "/account/profile",
  "/account", // Account settings page
  "/admin", // Admin routes (role check done separately in API/pages)
] as const;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

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

// Check if a role has a specific permission
export const hasPermissionForRole = (
  roleName: UserRole | string | undefined,
  permission: Permission
): boolean => {
  if (!roleName || !(roleName in ROLE_PERMISSIONS)) return false;
  return ROLE_PERMISSIONS[roleName as UserRole].includes(permission);
};

// Check if a route requires protection (either auth-only or permission-based)
export const isProtectedRoute = (pathname: string): boolean => {
  // Check permission-based routes
  const isPermissionRoute = Object.keys(PROTECTED_ROUTES).some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  if (isPermissionRoute) return true;

  // Check auth-only routes
  const isAuthRoute = AUTH_REQUIRED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  return isAuthRoute;
};

// Get required permissions for a route
export const getRoutePermissions = (pathname: string): Permission[] => {
  for (const [route, permissions] of Object.entries(PROTECTED_ROUTES)) {
    if (pathname === route || pathname.startsWith(`${route}/`)) {
      return permissions;
    }
  }
  return [];
};

// Check if user role has access to a route
export const hasRouteAccess = (
  pathname: string,
  roleName: UserRole | string | undefined
): boolean => {
  const requiredPermissions = getRoutePermissions(pathname);
  if (requiredPermissions.length === 0) return true;
  return requiredPermissions.every((permission) =>
    hasPermissionForRole(roleName, permission)
  );
};
