"use client";

import { cn } from "@/lib/utils";
import mapboxgl from "mapbox-gl";
import { memo, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { MAP_CONFIG } from "../constants";

type ClusterMarkerProps = {
  map: mapboxgl.Map;
  lng: number;
  lat: number;
  pointCount: number;
  onExpand: () => void;
};

/**
 * Marker component for displaying clustered posts
 * Shows count of posts in cluster, click to expand/zoom
 */
function ClusterMarker({
  map,
  lng,
  lat,
  pointCount,
  onExpand,
}: ClusterMarkerProps) {
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const contentRef = useRef<HTMLDivElement>(document.createElement("div"));
  const t = useTranslations();

  // Scale size based on point count using constants
  const size = Math.min(
    MAP_CONFIG.CLUSTER_MARKER_MIN_SIZE +
      (pointCount / MAP_CONFIG.CLUSTER_MARKER_SCALE_DIVISOR) *
        MAP_CONFIG.CLUSTER_MARKER_SCALE_FACTOR,
    MAP_CONFIG.CLUSTER_MARKER_MAX_SIZE
  );

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

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onExpand();
      }
    };

    contentEl.addEventListener("click", handleClick);
    contentEl.addEventListener("keydown", handleKeyDown);

    return () => {
      markerRef.current?.remove();
      contentEl.removeEventListener("click", handleClick);
      contentEl.removeEventListener("keydown", handleKeyDown);
    };
  }, [lng, lat, map, onExpand]);

  return createPortal(
    <div
      role="button"
      tabIndex={0}
      aria-label={t("map.clustering.posts_count", { count: pointCount })}
      className={cn(
        "flex items-center justify-center rounded-full cursor-pointer",
        "bg-white/90 backdrop-blur-[2px]",
        "text-gray-700",
        "border border-gray-200/50",
        "shadow-sm",
        "transition-all duration-200 hover:scale-110 hover:bg-white hover:z-50",
        "focus:outline-none focus:ring-2 focus:ring-primary/50"
      )}
      style={{ width: size, height: size }}
    >
      <span className="text-xs font-bold">
        {pointCount > 99 ? "99+" : pointCount}
      </span>
    </div>,
    contentRef.current
  );
}

export default memo(
  ClusterMarker,
  (prev, next) =>
    prev.lng === next.lng &&
    prev.lat === next.lat &&
    prev.pointCount === next.pointCount
);
