"use client";

import { useMemo } from "react";
import { PostMapMarker } from "@/services/client/posts";

// Distance threshold in pixels - markers within this distance are considered overlapping
const OVERLAP_THRESHOLD_PX = 40;

type OverlapGroup = {
  id: string;
  center: [number, number];
  markers: PostMapMarker[];
};

type UseOverlapDetectionParams = {
  posts: PostMapMarker[];
  zoom: number;
};

type UseOverlapDetectionResult = {
  /** Markers that don't overlap with others */
  singleMarkers: PostMapMarker[];
  /** Groups of overlapping markers */
  overlapGroups: OverlapGroup[];
};

/**
 * Convert pixel distance to lat/lng distance at given zoom level
 * This is approximate but good enough for overlap detection
 */
function pixelsToLatLng(pixels: number, zoom: number): number {
  // At zoom 0, the whole world (360 degrees) fits in 256 pixels
  // Each zoom level doubles the scale
  const worldSizePx = 256 * Math.pow(2, zoom);
  const degreesPerPixel = 360 / worldSizePx;
  return pixels * degreesPerPixel;
}

/**
 * Calculate distance between two coordinates in degrees
 */
function distance(a: PostMapMarker, b: PostMapMarker): number {
  const dx = a.lng - b.lng;
  const dy = a.lat - b.lat;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Group overlapping markers using simple clustering
 */
function groupOverlappingMarkers(
  posts: PostMapMarker[],
  thresholdDegrees: number
): { singles: PostMapMarker[]; groups: OverlapGroup[] } {
  if (posts.length === 0) {
    return { singles: [], groups: [] };
  }

  const used = new Set<number>();
  const groups: OverlapGroup[] = [];
  const singles: PostMapMarker[] = [];

  for (let i = 0; i < posts.length; i++) {
    if (used.has(posts[i].id)) continue;

    const group: PostMapMarker[] = [posts[i]];
    used.add(posts[i].id);

    // Find all markers within threshold distance
    for (let j = i + 1; j < posts.length; j++) {
      if (used.has(posts[j].id)) continue;

      if (distance(posts[i], posts[j]) < thresholdDegrees) {
        group.push(posts[j]);
        used.add(posts[j].id);
      }
    }

    if (group.length === 1) {
      singles.push(group[0]);
    } else {
      // Calculate center of group
      const centerLng = group.reduce((sum, m) => sum + m.lng, 0) / group.length;
      const centerLat = group.reduce((sum, m) => sum + m.lat, 0) / group.length;

      groups.push({
        id: `overlap-${group.map((m) => m.id).join("-")}`,
        center: [centerLng, centerLat],
        markers: group,
      });
    }
  }

  return { singles, groups };
}

/**
 * Hook to detect overlapping markers based on screen distance
 */
export function useOverlapDetection({
  posts,
  zoom,
}: UseOverlapDetectionParams): UseOverlapDetectionResult {
  const result = useMemo(() => {
    if (!posts.length) {
      return { singleMarkers: [], overlapGroups: [] };
    }

    // Convert pixel threshold to degrees at current zoom
    const thresholdDegrees = pixelsToLatLng(OVERLAP_THRESHOLD_PX, zoom);

    const { singles, groups } = groupOverlappingMarkers(
      posts,
      thresholdDegrees
    );

    return {
      singleMarkers: singles,
      overlapGroups: groups,
    };
  }, [posts, zoom]);

  return result;
}

export type { OverlapGroup };
