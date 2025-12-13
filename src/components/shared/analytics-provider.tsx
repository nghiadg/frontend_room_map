"use client";

import { useEffect } from "react";
import Script from "next/script";
import { GA4_MEASUREMENT_ID, initGA4 } from "@/lib/analytics";
import { CookieConsentBanner } from "@/components/shared/cookie-consent-banner";

/**
 * GA4 Analytics Provider
 * Initializes Google Analytics 4 with consent mode
 * Should be placed in the root layout
 */
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initGA4();
  }, []);

  return (
    <>
      {/* Google Analytics Script - only load if configured */}
      {GA4_MEASUREMENT_ID && (
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
      )}
      {children}
      {/* Cookie Consent Banner - always show, handles i18n internally */}
      <CookieConsentBanner />
    </>
  );
}
