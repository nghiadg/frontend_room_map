"use client";

import { cn } from "@/lib/utils";
import mapboxgl from "mapbox-gl";
import { memo, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { OverlapGroup } from "../hooks/use-overlap-detection";

type SpiderClusterMarkerProps = {
  map: mapboxgl.Map;
  group: OverlapGroup;
  onExpand: () => void;
  /** Whether this cluster is currently expanded (spiderfied) */
  isExpanded?: boolean;
};

/**
 * Marker component for overlapping posts that will spiderfy on click
 */
function SpiderClusterMarker({
  map,
  group,
  onExpand,
  isExpanded = false,
}: SpiderClusterMarkerProps) {
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const contentRef = useRef<HTMLDivElement>(document.createElement("div"));
  const t = useTranslations();

  const [lng, lat] = group.center;
  const count = group.markers.length;

  useEffect(() => {
    const contentEl = contentRef.current;
    if (!contentEl) return;

    markerRef.current = new mapboxgl.Marker({
      element: contentEl,
      anchor: "center",
    })
      .setLngLat([lng, lat])
      .addTo(map);

    const handleClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onExpand();
    };

    contentEl.addEventListener("click", handleClick);

    return () => {
      markerRef.current?.remove();
      contentEl.removeEventListener("click", handleClick);
    };
  }, [lng, lat, map, onExpand]);

  return createPortal(
    <div className="relative">
      {/* Pulse ring when expanded */}
      {isExpanded && (
        <div
          className="absolute inset-0 rounded-full bg-primary/30 animate-ping"
          style={{ willChange: "transform, opacity" }}
        />
      )}
      <div
        role="button"
        tabIndex={0}
        aria-label={t("map.clustering.posts_count", { count })}
        className={cn(
          "relative flex items-center justify-center",
          "w-7 h-7 rounded-full",
          "bg-white text-gray-600",
          "shadow-md",
          "border border-gray-300",
          "transition-all duration-200 hover:scale-110 hover:shadow-lg hover:z-50",
          "focus:outline-none focus:ring-2 focus:ring-primary/50",
          "cursor-pointer"
        )}
      >
        <span className="text-xs font-semibold">{count}</span>
      </div>
    </div>,
    contentRef.current
  );
}

export default memo(
  SpiderClusterMarker,
  (prev, next) =>
    prev.group.id === next.group.id &&
    prev.group.markers.length === next.group.markers.length &&
    prev.isExpanded === next.isExpanded
);
