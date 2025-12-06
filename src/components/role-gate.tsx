"use client";

import { Permission, UserRole } from "@/constants/user-role";
import { usePermissions } from "@/hooks/use-permissions";
import React from "react";

type RoleGateProps = {
  /**
   * Permission required to render children.
   * If provided, checks if user has this permission.
   */
  permission?: Permission;

  /**
   * Role required to render children.
   * If provided, checks if user has this role.
   * Note: If both permission and role are provided, permission takes precedence.
   */
  role?: UserRole;

  /**
   * Content to render when user doesn't have access.
   * If not provided, nothing is rendered.
   */
  fallback?: React.ReactNode;

  /**
   * Content to render when user has access.
   */
  children: React.ReactNode;

  /**
   * If true, shows loading state while checking permissions.
   * Default: false (shows nothing while loading)
   */
  showLoadingState?: boolean;

  /**
   * Custom loading component.
   */
  loadingComponent?: React.ReactNode;
};

/**
 * RoleGate component for declarative role-based rendering.
 * Use this to conditionally show/hide UI elements based on user permissions or roles.
 *
 * @example
 * ```tsx
 * // Check by permission
 * <RoleGate permission={PERMISSIONS.CREATE_POST}>
 *   <CreatePostButton />
 * </RoleGate>
 *
 * // Check by role
 * <RoleGate role="lessor">
 *   <LessorOnlyContent />
 * </RoleGate>
 *
 * // With fallback
 * <RoleGate permission={PERMISSIONS.EDIT_POST} fallback={<DisabledButton />}>
 *   <EditButton />
 * </RoleGate>
 * ```
 */
export function RoleGate({
  permission,
  role,
  fallback = null,
  children,
  showLoadingState = false,
  loadingComponent = null,
}: RoleGateProps) {
  const { hasPermission, hasRole, isLoading } = usePermissions();

  // Show loading state if requested
  if (isLoading && showLoadingState) {
    return <>{loadingComponent}</>;
  }

  // Don't render anything while loading (unless showLoadingState is true)
  if (isLoading) {
    return null;
  }

  // Check access based on permission or role
  const hasAccess = permission
    ? hasPermission(permission)
    : role
      ? hasRole(role)
      : false;

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}
