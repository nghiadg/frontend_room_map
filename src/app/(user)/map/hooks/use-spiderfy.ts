"use client";

import { useCallback, useState, useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import { PostMapMarker } from "@/services/client/posts";
import { OverlapGroup } from "./use-overlap-detection";

// Spider configuration
const SPIDER_CONFIG = {
  LEG_LENGTH: 30, // Distance from center to marker in pixels
  CIRCLE_SPIRAL_THRESHOLD: 8, // Use circle for <= 8 items, spiral for more
} as const;

type SpiderfyState = {
  isActive: boolean;
  groupId: string | null;
  center: [number, number] | null;
  markers: PostMapMarker[];
};

export type SpiderMarkerPosition = {
  post: PostMapMarker;
  position: [number, number];
};

type UseSpiderfyParams = {
  map: mapboxgl.Map | null;
  zoom: number;
};

type UseSpiderfyResult = {
  spiderfyState: SpiderfyState;
  spiderMarkers: SpiderMarkerPosition[];
  spiderfy: (group: OverlapGroup) => void;
  unspiderfy: () => void;
};

/**
 * Convert pixel distance to degrees at given zoom level
 */
function pixelsToDegreesAtZoom(pixels: number, zoom: number): number {
  const worldSizePx = 256 * Math.pow(2, zoom);
  const degreesPerPixel = 360 / worldSizePx;
  return pixels * degreesPerPixel;
}

/**
 * Calculate positions for spider markers in a circle pattern
 */
function calculateCirclePositions(
  count: number,
  center: [number, number],
  legLengthDegrees: number
): [number, number][] {
  const positions: [number, number][] = [];
  const angleStep = (2 * Math.PI) / count;

  for (let i = 0; i < count; i++) {
    const angle = i * angleStep - Math.PI / 2; // Start from top
    const x = center[0] + Math.cos(angle) * legLengthDegrees;
    const y = center[1] + Math.sin(angle) * legLengthDegrees;
    positions.push([x, y]);
  }

  return positions;
}

/**
 * Calculate positions for spider markers in a spiral pattern (for many markers)
 */
function calculateSpiralPositions(
  count: number,
  center: [number, number],
  baseLengthDegrees: number
): [number, number][] {
  const positions: [number, number][] = [];
  let angle = 0;
  const angleStep = 0.6; // radians between each marker

  for (let i = 0; i < count; i++) {
    const legLength = baseLengthDegrees * (1 + i * 0.15); // Increase length for each marker
    const x = center[0] + Math.cos(angle) * legLength;
    const y = center[1] + Math.sin(angle) * legLength;
    positions.push([x, y]);
    angle += angleStep;
  }

  return positions;
}

/**
 * Hook for spiderfying overlapping markers
 */
export function useSpiderfy({
  map,
  zoom,
}: UseSpiderfyParams): UseSpiderfyResult {
  const [spiderfyState, setSpiderfyState] = useState<SpiderfyState>({
    isActive: false,
    groupId: null,
    center: null,
    markers: [],
  });

  // Calculate spider marker positions
  const calculateSpiderPositions = useCallback(
    (
      markers: PostMapMarker[],
      center: [number, number]
    ): SpiderMarkerPosition[] => {
      const legLengthDegrees = pixelsToDegreesAtZoom(
        SPIDER_CONFIG.LEG_LENGTH,
        zoom
      );

      const positions =
        markers.length <= SPIDER_CONFIG.CIRCLE_SPIRAL_THRESHOLD
          ? calculateCirclePositions(markers.length, center, legLengthDegrees)
          : calculateSpiralPositions(markers.length, center, legLengthDegrees);

      return markers.map((post, index) => ({
        post,
        position: positions[index],
      }));
    },
    [zoom]
  );

  // Spiderfy a group
  const spiderfy = useCallback((group: OverlapGroup) => {
    // Just set state - useEffect will handle leg drawing
    setSpiderfyState({
      isActive: true,
      groupId: group.id,
      center: group.center,
      markers: group.markers,
    });
  }, []);

  // Unspiderfy - collapse back
  const unspiderfy = useCallback(() => {
    setSpiderfyState({
      isActive: false,
      groupId: null,
      center: null,
      markers: [],
    });
  }, []);

  // Auto-unspiderfy on map move/zoom
  useEffect(() => {
    if (!map) return;

    const handleMapMove = () => {
      if (spiderfyState.isActive) {
        unspiderfy();
      }
    };

    map.on("movestart", handleMapMove);

    return () => {
      map.off("movestart", handleMapMove);
    };
  }, [map, spiderfyState.isActive, unspiderfy]);

  // Calculate current spider markers
  const spiderMarkers =
    spiderfyState.isActive && spiderfyState.center
      ? calculateSpiderPositions(spiderfyState.markers, spiderfyState.center)
      : [];

  return {
    spiderfyState,
    spiderMarkers,
    spiderfy,
    unspiderfy,
  };
}
