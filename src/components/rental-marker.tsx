"use client";
import IconRental from "@/components/icons/icon-rental";
import { cn } from "@/lib/utils";
import mapboxgl from "mapbox-gl";
import { memo, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import RentalMarkerPopup from "./rental-marker-popup";
import { useIsMobile } from "@/hooks/use-mobile";
import NiceModal from "@ebay/nice-modal-react";
import { RentalMarkerModal } from "./rental-marker-modal";

type RentalMarkerProps = {
  lng: number;
  lat: number;
  map: mapboxgl.Map;
};

function RentalMarker({ map, lng, lat }: RentalMarkerProps) {
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const contentRef = useRef<HTMLDivElement>(document.createElement("div"));
  const popupRef = useRef<HTMLDivElement>(document.createElement("div"));
  const popupInstanceRef = useRef<mapboxgl.Popup | null>(null);
  const isMobile = useIsMobile();
  console.log(isMobile);

  useEffect(() => {
    const contentEl = contentRef.current;
    if (!contentEl) return;
    markerRef.current = new mapboxgl.Marker({
      element: contentEl,
      anchor: "bottom",
    })
      .setLngLat([lng, lat])
      .addTo(map);

    popupInstanceRef.current = new mapboxgl.Popup({
      offset: 30,
      closeButton: false,
      anchor: "left",
      className:
        "[&_.mapboxgl-popup-tip]:hidden [&_.mapboxgl-popup-content]:!p-0",
    })
      .setLngLat([lng, lat])
      .setDOMContent(popupRef.current);

    const handleMarkerClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (isMobile) {
        NiceModal.show(RentalMarkerModal);
        return;
      }

      if (popupInstanceRef.current?.isOpen()) {
        popupInstanceRef.current?.remove();
      } else {
        popupInstanceRef.current?.addTo(map);
      }
    };

    contentEl.addEventListener("click", handleMarkerClick);

    return () => {
      markerRef.current?.remove();
      popupInstanceRef.current?.remove();
      contentEl.removeEventListener("click", handleMarkerClick);
    };
  }, [isMobile, lat, lng, map]);

  return (
    <>
      {createPortal(
        <div
          className={cn(
            "inline-flex items-center justify-center p-1 bg-white transition-all duration-300 rounded-sm shadow-md relative cursor-default",
            "before:content-[''] before:w-1.5 before:h-1.5 before:rotate-45 before:bg-white before:absolute before:-bottom-0.5 before:left-1/2 before:-translate-x-1/2 shadow-md"
          )}
        >
          <IconRental className="text-primary" size={16} />
          <span className="text-primary text-xs font-medium">4tr3đ</span>
        </div>,
        contentRef.current!
      )}
      {/* popup */}
      {createPortal(
        <RentalMarkerPopup
          onClose={() => {
            popupInstanceRef.current?.remove();
          }}
        />,
        popupRef.current!
      )}
    </>
  );
}

export default memo(
  RentalMarker,
  (prev, next) => prev.lng === next.lng && prev.lat === next.lat
);
