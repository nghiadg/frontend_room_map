"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getConsentState,
  saveConsentState,
  COOKIE_CONSENT_KEY,
  type ConsentState,
} from "@/lib/analytics";

/**
 * Hook to manage cookie consent state
 * Handles storage, syncing with GA4, and UI state
 */
export function useCookieConsent() {
  const [consent, setConsent] = useState<ConsentState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showBanner, setShowBanner] = useState(false);

  // Load consent from localStorage on mount
  useEffect(() => {
    const storedConsent = getConsentState();
    setConsent(storedConsent);
    setShowBanner(!storedConsent);
    setIsLoading(false);
  }, []);

  /**
   * Accept all analytics cookies
   */
  const acceptAll = useCallback(() => {
    const newConsent = {
      analytics: true,
      ads: true,
      personalization: true,
    };
    saveConsentState(newConsent);
    setConsent({ ...newConsent, timestamp: Date.now() });
    setShowBanner(false);
  }, []);

  /**
   * Reject all non-essential cookies
   */
  const rejectAll = useCallback(() => {
    const newConsent = {
      analytics: false,
      ads: false,
      personalization: false,
    };
    saveConsentState(newConsent);
    setConsent({ ...newConsent, timestamp: Date.now() });
    setShowBanner(false);
  }, []);

  /**
   * Accept only analytics cookies (no ads/personalization)
   */
  const acceptAnalyticsOnly = useCallback(() => {
    const newConsent = {
      analytics: true,
      ads: false,
      personalization: false,
    };
    saveConsentState(newConsent);
    setConsent({ ...newConsent, timestamp: Date.now() });
    setShowBanner(false);
  }, []);

  /**
   * Reset consent (show banner again)
   */
  const resetConsent = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(COOKIE_CONSENT_KEY);
    }
    setConsent(null);
    setShowBanner(true);
  }, []);

  return {
    consent,
    isLoading,
    showBanner,
    hasAnalyticsConsent: consent?.analytics ?? false,
    acceptAll,
    rejectAll,
    acceptAnalyticsOnly,
    resetConsent,
  };
}
