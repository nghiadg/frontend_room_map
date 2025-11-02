"use client";

import { DEFAULT_LAT_HN, DEFAULT_LNG_HN } from "@/constants/location";
import { cn } from "@/lib/utils";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useLayoutEffect, useRef } from "react";

type MapBoxProps = {
  ref: React.RefObject<mapboxgl.Map | null>;
  initialLng?: number;
  initialLat?: number;
  initialZoom: number;
  wrapperClassName: string;
  children?: React.ReactNode;
  maxZoom?: number;
  minZoom?: number;
  maxBounds?: [[number, number], [number, number]];
  onMapReady?: () => void;
};

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
}: MapBoxProps) {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

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
      });

      ref.current = mapRef.current;
      onMapReady?.();
      return () => {
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
          ref.current = null;
        }
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div className={cn("w-full h-full", wrapperClassName)}>
      <div id="map-container" ref={mapContainerRef} className="w-full h-full" />
      {children}
    </div>
  );
}
