"use client";

import { useUserStore } from "@/store/userStore";
import {
  Permission,
  PERMISSIONS,
  ROLE_PERMISSIONS,
  UserRole,
  hasPermissionForRole,
} from "@/constants/user-role";

/**
 * Hook for checking user permissions and roles.
 * Use this hook in components that need to conditionally render based on user permissions.
 *
 * @example
 * ```tsx
 * const { canCreatePost, canEditPost, hasPermission, hasRole } = usePermissions();
 *
 * // Check specific permissions
 * if (canCreatePost) {
 *   // show create button
 * }
 *
 * // Check any permission
 * if (hasPermission(PERMISSIONS.DELETE_POST)) {
 *   // show delete button
 * }
 *
 * // Check role
 * if (hasRole('lessor')) {
 *   // show lessor-specific content
 * }
 * ```
 */
export function usePermissions() {
  const { profile, isProfileLoading } = useUserStore();

  const roleName = profile?.roleName;

  /**
   * Check if current user has a specific permission
   */
  const hasPermission = (permission: Permission): boolean => {
    return hasPermissionForRole(roleName, permission);
  };

  /**
   * Check if current user has a specific role
   */
  const hasRole = (role: UserRole): boolean => {
    return roleName === role;
  };

  /**
   * Check if current user has ANY of the specified permissions
   */
  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some((permission) => hasPermission(permission));
  };

  /**
   * Check if current user has ALL of the specified permissions
   */
  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return permissions.every((permission) => hasPermission(permission));
  };

  /**
   * Get all permissions for the current user's role
   */
  const getPermissions = (): readonly Permission[] => {
    if (!roleName || !(roleName in ROLE_PERMISSIONS)) return [];
    return ROLE_PERMISSIONS[roleName as UserRole];
  };

  // Convenience flags for common permission checks
  const canCreatePost = hasPermission(PERMISSIONS.CREATE_POST);
  const canEditPost = hasPermission(PERMISSIONS.EDIT_POST);
  const canDeletePost = hasPermission(PERMISSIONS.DELETE_POST);
  const canMarkAsRented = hasPermission(PERMISSIONS.MARK_AS_RENTED);

  // Auth state
  const isAuthenticated = !!profile;
  const isLoading = isProfileLoading;

  // =============================================================================
  // OWNERSHIP CHECKS (UX layer - Supabase RLS handles security)
  // =============================================================================

  /**
   * Check if current user owns a resource (by owner profile ID)
   */
  const isOwner = (ownerProfileId: number | undefined): boolean => {
    if (!profile?.id || !ownerProfileId) return false;
    return profile.id === ownerProfileId;
  };

  /**
   * Check if user can edit a specific post (has permission AND owns it)
   */
  const canEditOwnPost = (postOwnerProfileId: number | undefined): boolean => {
    return canEditPost && isOwner(postOwnerProfileId);
  };

  /**
   * Check if user can delete a specific post (has permission AND owns it)
   */
  const canDeleteOwnPost = (
    postOwnerProfileId: number | undefined
  ): boolean => {
    return canDeletePost && isOwner(postOwnerProfileId);
  };

  /**
   * Check if user can mark a specific post as rented (has permission AND owns it)
   */
  const canMarkOwnPostAsRented = (
    postOwnerProfileId: number | undefined
  ): boolean => {
    return canMarkAsRented && isOwner(postOwnerProfileId);
  };

  return {
    // Auth state
    isAuthenticated,
    isLoading,
    profile,
    roleName,

    // Permission checks
    hasPermission,
    hasRole,
    hasAnyPermission,
    hasAllPermissions,
    getPermissions,

    // Convenience flags (role-based)
    canCreatePost,
    canEditPost,
    canDeletePost,
    canMarkAsRented,

    // Ownership checks (resource-based - UX layer)
    isOwner,
    canEditOwnPost,
    canDeleteOwnPost,
    canMarkOwnPostAsRented,

    // Re-export PERMISSIONS for convenience
    PERMISSIONS,
  };
}
