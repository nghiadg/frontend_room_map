"use client";

import { useTranslations } from "next-intl";
import { ZoomIn } from "lucide-react";

type ZoomWarningProps = {
  className?: string;
};

/**
 * Warning banner shown when map is zoomed out too far
 * Prompts user to zoom in to see rental posts
 */
export default function ZoomWarning({ className }: ZoomWarningProps) {
  const t = useTranslations();

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 ${className ?? ""}`}
    >
      <div className="flex items-center gap-2 px-3 py-2 bg-background/95 backdrop-blur-sm border rounded-full shadow-lg animate-in fade-in slide-in-from-top-2 duration-300">
        <ZoomIn
          className="w-4 h-4 text-muted-foreground shrink-0"
          aria-hidden="true"
        />
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {t("map.clustering.zoom_in_to_see")}
        </span>
      </div>
    </div>
  );
}
