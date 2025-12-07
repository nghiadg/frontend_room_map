// Dashboard statistics types

export interface DashboardOverview {
  totalPosts: number;
  availablePosts: number;
  rentedPosts: number;
  deletedPosts: number;
  totalUsers: number;
  postsLast30Days: number;
}

export interface PostsByPropertyType {
  key: string;
  name: string;
  count: number;
}

export interface PostsByStatus {
  status: "available" | "rented" | "deleted";
  count: number;
}

export interface PostsTrend {
  date: string;
  count: number;
}

export interface TopDistrict {
  districtName: string;
  provinceName: string;
  count: number;
}

// ============================================================================
// Constants
// ============================================================================

/** Stale time for dashboard data queries (5 minutes) */
export const DASHBOARD_STALE_TIME_MS = 1000 * 60 * 5;

/** Standard height for chart containers */
export const CHART_HEIGHT = "250px";

/** Default number of days for trend chart */
export const TREND_DAYS_BACK = 30;

/** Default number of top districts to show */
export const TOP_DISTRICTS_LIMIT = 5;

// ============================================================================
// Chart Colors
// ============================================================================

export const STATUS_COLORS: Record<PostsByStatus["status"], string> = {
  available: "hsl(142, 76%, 36%)", // green
  rented: "hsl(221, 83%, 53%)", // blue
  deleted: "hsl(0, 84%, 60%)", // red
} as const;

// Property type colors - vibrant palette
export const PROPERTY_TYPE_COLORS = [
  "hsl(221, 83%, 53%)", // blue
  "hsl(142, 76%, 36%)", // green
  "hsl(262, 83%, 58%)", // purple
  "hsl(24, 95%, 53%)", // orange
  "hsl(350, 89%, 60%)", // pink
  "hsl(47, 96%, 53%)", // yellow
] as const;

/** Primary chart color for single-color charts */
export const PRIMARY_CHART_COLOR = "hsl(221, 83%, 53%)";
