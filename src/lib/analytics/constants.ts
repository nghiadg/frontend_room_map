/**
 * GA4 Analytics Constants
 * Event names and configuration for Google Analytics 4
 */

// GA4 Measurement ID from environment
export const GA4_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || "";

/**
 * GA4 Event Names
 * Following Google's recommended event naming conventions
 * @see https://developers.google.com/analytics/devguides/collection/ga4/reference/events
 */
export const GA4_EVENTS = {
  // Authentication events
  LOGIN: "login",
  SIGN_UP: "sign_up",
  LOGOUT: "logout",

  // Ecommerce-style events (for rental listings)
  VIEW_ITEM: "view_item",
  SELECT_ITEM: "select_item",
  VIEW_ITEM_LIST: "view_item_list",
  ADD_TO_WISHLIST: "add_to_wishlist",

  // Lead generation
  GENERATE_LEAD: "generate_lead",

  // Post creation funnel
  BEGIN_CHECKOUT: "begin_checkout", // Start creating post
  PURCHASE: "purchase", // Successfully publish post

  // Search & Discovery
  SEARCH: "search",

  // Custom events
  MAP_INTERACTION: "map_interaction",
  FILTER_APPLIED: "filter_applied",
  CONTACT_HOST: "contact_host",
} as const;

export type GA4EventName = (typeof GA4_EVENTS)[keyof typeof GA4_EVENTS];

/**
 * Cookie consent storage key
 */
export const COOKIE_CONSENT_KEY = "roommap_cookie_consent";

/**
 * Consent categories
 */
export const CONSENT_CATEGORIES = {
  ANALYTICS: "analytics_storage",
  ADS: "ad_storage",
  PERSONALIZATION: "ad_personalization",
  FUNCTIONALITY: "functionality_storage",
} as const;

/**
 * Events that require user consent (GDPR sensitive)
 */
export const CONSENT_REQUIRED_EVENTS = new Set<GA4EventName>([
  GA4_EVENTS.GENERATE_LEAD,
  GA4_EVENTS.CONTACT_HOST,
  GA4_EVENTS.BEGIN_CHECKOUT,
  GA4_EVENTS.PURCHASE,
  GA4_EVENTS.ADD_TO_WISHLIST,
]);

/**
 * Check if an event requires consent
 */
export const requiresConsent = (eventName: GA4EventName): boolean => {
  return CONSENT_REQUIRED_EVENTS.has(eventName);
};
