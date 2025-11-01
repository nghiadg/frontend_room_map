"use client";

import { cn } from "@/lib/utils";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef } from "react";

type MapBoxProps = {
  ref: React.RefObject<mapboxgl.Map | null>;
  initialLng: number;
  initialLat: number;
  initialZoom: number;
  wrapperClassName: string;
  children?: React.ReactNode;
  maxZoom?: number;
  minZoom?: number;
  maxBounds?: [[number, number], [number, number]];
};

export default function MapBox({
  ref,
  initialLng,
  initialLat,
  initialZoom,
  wrapperClassName,
  children,
  maxZoom,
  minZoom,
  maxBounds,
}: MapBoxProps) {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;
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
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        ref.current = null;
      }
    };
  }, [initialLat, initialLng, initialZoom, ref]);

  return (
    <div className={cn("w-full h-full", wrapperClassName)}>
      <div id="map-container" ref={mapContainerRef} className="w-full h-full" />
      {children}
    </div>
  );
}
