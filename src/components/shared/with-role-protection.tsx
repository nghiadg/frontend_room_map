"use client";

import { Permission, UserRole } from "@/constants/user-role";
import { usePermissions } from "@/hooks/use-permissions";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

type WithRoleProtectionOptions = {
  /**
   * Permission required to access the component.
   */
  permission?: Permission;

  /**
   * Role required to access the component.
   * Note: If both permission and role are provided, permission takes precedence.
   */
  role?: UserRole;

  /**
   * URL to redirect to if user doesn't have access.
   * Default: "/"
   */
  redirectTo?: string;

  /**
   * Custom loading component to show while checking permissions.
   */
  LoadingComponent?: React.ComponentType;
};

/**
 * HOC for page-level protection with redirect.
 * Use this to protect entire pages from unauthorized access.
 *
 * @example
 * ```tsx
 * // Protect a page client component
 * function CreatePostPageClient() {
 *   return <PostForm />;
 * }
 *
 * export default withRoleProtection(CreatePostPageClient, {
 *   permission: PERMISSIONS.CREATE_POST,
 *   redirectTo: '/',
 * });
 *
 * // Or with role check
 * export default withRoleProtection(LessorDashboard, {
 *   role: 'lessor',
 *   redirectTo: '/login',
 * });
 * ```
 */
export function withRoleProtection<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithRoleProtectionOptions
) {
  const { permission, role, redirectTo = "/", LoadingComponent } = options;

  function ProtectedComponent(props: P) {
    const { hasPermission, hasRole, isLoading, isAuthenticated } =
      usePermissions();
    const router = useRouter();

    const hasAccess = permission
      ? hasPermission(permission)
      : role
        ? hasRole(role)
        : false;

    useEffect(() => {
      // Only redirect after loading is complete and user doesn't have access
      if (!isLoading && !hasAccess) {
        router.replace(redirectTo);
      }
    }, [isLoading, hasAccess, router]);

    // Show loading state
    if (isLoading) {
      if (LoadingComponent) {
        return <LoadingComponent />;
      }
      return null;
    }

    // User doesn't have access - will be redirected
    if (!hasAccess) {
      return null;
    }

    // User has access - render the component
    return <WrappedComponent {...props} />;
  }

  // Set display name for debugging
  const wrappedName =
    WrappedComponent.displayName || WrappedComponent.name || "Component";
  ProtectedComponent.displayName = `withRoleProtection(${wrappedName})`;

  return ProtectedComponent;
}
