"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useCookieConsent } from "@/hooks/use-cookie-consent";
import { Button } from "@/components/ui/button";
import { Cookie, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * GDPR-compliant Cookie Consent Banner
 * Shows at the bottom of the screen until user makes a choice
 * Syncs with GA4 consent mode
 */
export function CookieConsentBanner() {
  const t = useTranslations("cookie_consent");
  const { showBanner, acceptAll, rejectAll, isLoading } = useCookieConsent();
  const [isVisible, setIsVisible] = useState(false);

  // Animate in after mount
  useEffect(() => {
    if (showBanner && !isLoading) {
      // Small delay to ensure smooth animation
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [showBanner, isLoading]);

  if (isLoading || !showBanner) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 p-4 transition-all duration-300 ease-out",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      )}
    >
      <div className="mx-auto max-w-3xl">
        <div className="rounded-lg border bg-background/95 backdrop-blur-sm shadow-lg p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
            {/* Icon */}
            <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Cookie className="h-5 w-5 text-primary" />
            </div>

            {/* Content */}
            <div className="flex-1 space-y-2">
              <h2
                id="cookie-consent-title"
                className="text-sm font-semibold text-foreground flex items-center gap-2"
              >
                <Cookie className="h-4 w-4 sm:hidden text-primary" />
                {t("title")}
              </h2>
              <p
                id="cookie-consent-description"
                className="text-sm text-muted-foreground"
              >
                {t("description")}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={rejectAll}
                className="text-muted-foreground hover:text-foreground"
              >
                {t("reject")}
              </Button>
              <Button size="sm" onClick={acceptAll}>
                {t("accept")}
              </Button>
            </div>

            {/* Close button (mobile) */}
            <button
              onClick={rejectAll}
              className="absolute right-2 top-2 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground sm:hidden"
              aria-label={t("close")}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
