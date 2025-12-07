/**
 * Constants for "Coming Soon" feature keys.
 * Used to identify which feature the Coming Soon dialog is being shown for.
 * These keys must match the keys in vn.json under "coming_soon.features".
 */
export const COMING_SOON_FEATURES = {
  SEARCH: "search",
  FAVORITES: "favorites",
  NOTIFICATIONS: "notifications",
} as const;

export type ComingSoonFeatureKey =
  (typeof COMING_SOON_FEATURES)[keyof typeof COMING_SOON_FEATURES];
