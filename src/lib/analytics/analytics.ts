/**
 * GA4 Analytics Core Module
 * Handles initialization, consent management, and event tracking
 */

import {
  GA4_MEASUREMENT_ID,
  COOKIE_CONSENT_KEY,
  CONSENT_CATEGORIES,
  requiresConsent,
  type GA4EventName,
} from "./constants";

// Type declarations for gtag
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

/**
 * Consent state stored in localStorage
 */
export type ConsentState = {
  analytics: boolean;
  ads: boolean;
  personalization: boolean;
  timestamp: number;
};

/**
 * Get consent state from localStorage
 */
export const getConsentState = (): ConsentState | null => {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

/**
 * Save consent state to localStorage
 */
export const saveConsentState = (state: Omit<ConsentState, "timestamp">) => {
  if (typeof window === "undefined") return;

  const consentState: ConsentState = {
    ...state,
    timestamp: Date.now(),
  };

  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consentState));

  // Update GA4 consent
  updateGtagConsent(state.analytics);
};

/**
 * Update Google Analytics consent mode
 */
const updateGtagConsent = (granted: boolean) => {
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag("consent", "update", {
    [CONSENT_CATEGORIES.ANALYTICS]: granted ? "granted" : "denied",
    [CONSENT_CATEGORIES.ADS]: granted ? "granted" : "denied",
    [CONSENT_CATEGORIES.PERSONALIZATION]: granted ? "granted" : "denied",
  });
};

/**
 * Check if analytics consent is granted
 */
export const hasAnalyticsConsent = (): boolean => {
  const consent = getConsentState();
  return consent?.analytics ?? false;
};

/**
 * Initialize GA4 with consent mode defaults
 * This should be called in the root layout
 */
export const initGA4 = () => {
  if (typeof window === "undefined" || !GA4_MEASUREMENT_ID) return;

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];

  // Define gtag function
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };

  // Set default consent (denied until user accepts)
  window.gtag("consent", "default", {
    [CONSENT_CATEGORIES.ANALYTICS]: "denied",
    [CONSENT_CATEGORIES.ADS]: "denied",
    [CONSENT_CATEGORIES.PERSONALIZATION]: "denied",
    [CONSENT_CATEGORIES.FUNCTIONALITY]: "granted",
    wait_for_update: 500,
  });

  // Initialize GA4
  window.gtag("js", new Date());
  window.gtag("config", GA4_MEASUREMENT_ID, {
    page_path: window.location.pathname,
    debug_mode: process.env.NODE_ENV === "development",
  });

  // Check for existing consent
  const existingConsent = getConsentState();
  if (existingConsent) {
    updateGtagConsent(existingConsent.analytics);
  }
};

/**
 * Track a custom event with GA4
 * Some events require consent and will be skipped if not granted
 */
export const trackEvent = (
  eventName: GA4EventName,
  params?: Record<string, unknown>
) => {
  if (typeof window === "undefined" || !window.gtag || !GA4_MEASUREMENT_ID)
    return;

  // Check consent for sensitive events
  if (requiresConsent(eventName) && !hasAnalyticsConsent()) {
    if (process.env.NODE_ENV === "development") {
      console.log(`[GA4] Event "${eventName}" skipped - no consent`);
    }
    return;
  }

  window.gtag("event", eventName, params);

  if (process.env.NODE_ENV === "development") {
    console.log(`[GA4] Event tracked: ${eventName}`, params);
  }
};

/**
 * Track page view
 */
export const trackPageView = (url: string, title?: string) => {
  if (typeof window === "undefined" || !window.gtag || !GA4_MEASUREMENT_ID)
    return;

  window.gtag("event", "page_view", {
    page_path: url,
    page_title: title,
  });
};

/**
 * Set user ID for cross-device tracking
 */
export const setUserId = (userId: string | null) => {
  if (typeof window === "undefined" || !window.gtag || !GA4_MEASUREMENT_ID)
    return;

  window.gtag("config", GA4_MEASUREMENT_ID, {
    user_id: userId,
  });
};

/**
 * Set user properties
 */
export const setUserProperties = (properties: Record<string, unknown>) => {
  if (typeof window === "undefined" || !window.gtag || !GA4_MEASUREMENT_ID)
    return;

  window.gtag("set", "user_properties", properties);
};
