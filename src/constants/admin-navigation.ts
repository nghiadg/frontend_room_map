import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  LucideIcon,
} from "lucide-react";

/**
 * Admin navigation item configuration
 */
export interface AdminNavItem {
  /** i18n key for the nav item title */
  titleKey: string;
  /** Route URL path */
  url: string;
  /** Lucide icon component */
  icon: LucideIcon;
}

/**
 * Admin navigation items - single source of truth for both sidebar and header
 */
export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    titleKey: "admin.sidebar.dashboard",
    url: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    titleKey: "admin.sidebar.posts",
    url: "/admin/posts",
    icon: FileText,
  },
  {
    titleKey: "admin.sidebar.users",
    url: "/admin/users",
    icon: Users,
  },
  {
    titleKey: "admin.sidebar.settings",
    url: "/admin/settings",
    icon: Settings,
  },
] as const;

/**
 * Get the i18n title key for a given route path
 */
export function getRouteTitleKey(pathname: string): string {
  const navItem = ADMIN_NAV_ITEMS.find((item) => item.url === pathname);
  return navItem?.titleKey || "admin.sidebar.dashboard";
}
