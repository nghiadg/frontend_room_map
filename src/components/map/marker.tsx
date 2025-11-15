"use client";
import { createPortal } from "react-dom";
import { useMapContext } from "./mapbox-context";
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

export type MarkerProps = {
  lng: number;
  lat: number;
  element: React.ReactNode;
  anchor?: "bottom" | "top" | "left" | "right";
};

export default function Marker({
  lng,
  lat,
  element,
  anchor = "bottom",
}: MarkerProps) {
  const { mapRef } = useMapContext();
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      containerRef.current = document.createElement("div");
    }

    if (!containerRef.current || !mapRef.current || !lng || !lat) return;
    const marker = new mapboxgl.Marker({
      element: containerRef.current,
      anchor: anchor,
    })
      .setLngLat([lng, lat])
      .addTo(mapRef.current);

    markerRef.current = marker;

    return () => {
      marker?.remove();
    };
  }, [anchor, lat, lng, mapRef]);

  return (
    <>{containerRef.current && createPortal(element, containerRef.current)}</>
  );
}
