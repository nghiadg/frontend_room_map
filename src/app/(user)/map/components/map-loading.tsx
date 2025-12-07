"use client";

import { MapPin, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function MapLoading() {
  const t = useTranslations("map");

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background">
      {/* Animated map icon */}
      <div className="relative mb-6">
        <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <MapPin className="h-10 w-10 text-primary animate-bounce" />
        </div>
      </div>

      {/* Loading text */}
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm font-medium">{t("loading")}</span>
      </div>

      {/* Skeleton map grid effect */}
      <div className="absolute inset-0 -z-10 overflow-hidden opacity-5">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, currentColor 1px, transparent 1px),
              linear-gradient(to bottom, currentColor 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
      </div>
    </div>
  );
}
