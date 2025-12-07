import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  LucideIcon,
} from "lucide-react";

/**
 * Admin navigation sub-item configuration
 */
export interface AdminNavSubItem {
  /** i18n key for the nav item title */
  titleKey: string;
  /** Route URL path */
  url: string;
}

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
  /** Sub-items for collapsible menu */
  subItems?: AdminNavSubItem[];
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
    subItems: [
      {
        titleKey: "admin.settings.roles.title",
        url: "/admin/settings/roles",
      },
      // Future sub-items:
      // { titleKey: "admin.settings.propertyTypes.title", url: "/admin/settings/property-types" },
      // { titleKey: "admin.settings.amenities.title", url: "/admin/settings/amenities" },
    ],
  },
] as const;

/**
 * Get the i18n title key for a given route path
 */
export function getRouteTitleKey(pathname: string): string {
  // Check main items first
  for (const item of ADMIN_NAV_ITEMS) {
    if (pathname === item.url || pathname.startsWith(item.url + "/")) {
      // Check sub-items if exists
      if (item.subItems) {
        const subItem = item.subItems.find((sub) => pathname === sub.url);
        if (subItem) return subItem.titleKey;
      }
      return item.titleKey;
    }
  }
  return "admin.sidebar.dashboard";
}
