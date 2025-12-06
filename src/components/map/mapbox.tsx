"use client";

import { DEFAULT_LAT_HN, DEFAULT_LNG_HN } from "@/constants/location";
import { cn } from "@/lib/utils";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { MapBoxProvider } from "./mapbox-context";

type MapBoxProps = {
  ref: React.RefObject<mapboxgl.Map | null>;
  initialLng?: number;
  initialLat?: number;
  initialZoom: number;
  wrapperClassName: string;
  children?: React.ReactNode;
  onMapReady?: () => void;
} & Omit<mapboxgl.MapOptions, "container">;

export default function MapBox({
  ref,
  initialLng = DEFAULT_LNG_HN,
  initialLat = DEFAULT_LAT_HN,
  initialZoom,
  wrapperClassName,
  children,
  maxZoom,
  minZoom,
  maxBounds,
  onMapReady,
  ...options
}: MapBoxProps) {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  useLayoutEffect(
    () => {
      if (!mapContainerRef.current || mapRef.current) return;
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        center: [initialLng, initialLat],
        zoom: initialZoom,
        maxZoom: maxZoom,
        minZoom: minZoom,
        maxBounds: maxBounds,
        ...options,
      });

      ref.current = mapRef.current;
      setIsMapReady(true);
      onMapReady?.();
      return () => {
        if (mapRef.current) {
          const map = mapRef.current;
          // Clear refs first to prevent any further operations
          mapRef.current = null;
          ref.current = null;

          // Remove map with AbortError handling
          try {
            // Check if map is still attached to DOM before removing
            if (map.getContainer()?.parentNode) {
              map.remove();
            }
          } catch (error) {
            // Ignore AbortError that occurs when map is removed while still loading
            // This commonly happens during React StrictMode or fast navigation
            if (error instanceof DOMException && error.name === "AbortError") {
              // Silently ignore - this is expected during cleanup
              return;
            }
            // Re-throw other errors
            throw error;
          }
        }
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    if (!mapContainerRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        mapRef.current?.resize();
      }
    });
    observer.observe(mapContainerRef.current);
    return () => observer.disconnect();
  }, [mapRef]);

  return (
    <MapBoxProvider value={{ mapRef: mapRef, isMapReady: isMapReady }}>
      <div className={cn("w-full h-full", wrapperClassName)}>
        <div
          id="map-container"
          ref={mapContainerRef}
          className="w-full h-full"
        />
        {children}
      </div>
    </MapBoxProvider>
  );
}
