"use client";
import IconRental from "@/components/icons/icon-rental";
import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

type RentalMarkerProps = {
  lng: number;
  lat: number;
  map: mapboxgl.Map;
  popupContent?: React.ReactNode;
};

export default function RentalMarker({
  map,
  lng,
  lat,
  popupContent,
}: RentalMarkerProps) {
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const contentRef = useRef<HTMLDivElement>(document.createElement("div"));
  const popupRef = useRef<HTMLDivElement>(document.createElement("div"));

  useEffect(() => {
    if (!contentRef.current) return;
    markerRef.current = new mapboxgl.Marker({
      element: contentRef.current,
      anchor: "bottom",
    })
      .setLngLat([lng, lat])
      .addTo(map);

    const popup = new mapboxgl.Popup({
      offset: 30,
      closeButton: false,
      anchor: "left",
      className:
        "[&_.mapboxgl-popup-tip]:hidden [&_.mapboxgl-popup-content]:!p-0",
    })
      .setLngLat([lng, lat])
      .setDOMContent(popupRef.current);

    contentRef.current.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      popup.addTo(map);
    });

    return () => {
      markerRef.current?.remove();
      popup.remove();
    };
  }, [lat, lng, map]);

  return (
    <>
      {createPortal(
        <div
          className={cn(
            "inline-flex items-center justify-center p-1 bg-white transition-all duration-300 rounded-sm shadow-md relative",
            "before:content-[''] before:w-1.5 before:h-1.5 before:rotate-45 before:bg-white before:absolute before:-bottom-0.5 before:left-1/2 before:-translate-x-1/2 shadow-md"
          )}
        >
          <IconRental className="text-primary" size={16} />
          <span className="text-primary text-xs font-medium">4tr3đ</span>
        </div>,
        contentRef.current!
      )}
      {/* popup */}
      {popupContent && createPortal(popupContent, popupRef.current!)}
    </>
  );
}
