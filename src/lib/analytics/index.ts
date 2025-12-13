/**
 * Analytics Module - Public API
 * Re-exports all analytics utilities for easy imports
 */

// Core analytics
export {
  initGA4,
  trackEvent,
  trackPageView,
  setUserId,
  setUserProperties,
  getConsentState,
  saveConsentState,
  hasAnalyticsConsent,
  type ConsentState,
} from "./analytics";

// Typed event tracking functions
export {
  // Auth events
  trackLogin,
  trackSignUp,
  trackLogout,
  // Post events
  trackViewItem,
  trackSelectItem,
  trackViewItemList,
  // Lead generation
  trackGenerateLead,
  // Post creation funnel
  trackBeginCheckout,
  trackPostPublished,
  // Search & discovery
  trackSearch,
} from "./events";

// Constants
export {
  GA4_MEASUREMENT_ID,
  GA4_EVENTS,
  COOKIE_CONSENT_KEY,
  requiresConsent,
  type GA4EventName,
} from "./constants";
