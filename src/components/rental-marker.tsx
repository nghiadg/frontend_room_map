"use client";
import { cn } from "@/lib/utils";
import { formatVietnamCurrencyShort } from "@/lib/utils/currency";
import { getPropertyTypeIcon } from "@/lib/utils/property-type-icons";
import { PostMapMarker } from "@/services/client/posts";
import mapboxgl from "mapbox-gl";
import { memo, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import RentalMarkerPopup from "./rental-marker-popup";
import { useIsMobile } from "@/hooks/use-mobile";
import NiceModal from "@ebay/nice-modal-react";
import { RentalMarkerModal } from "./rental-marker-modal";

type RentalMarkerProps = {
  post: PostMapMarker;
  map: mapboxgl.Map;
};

function RentalMarker({ map, post }: RentalMarkerProps) {
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const contentRef = useRef<HTMLDivElement>(document.createElement("div"));
  const popupRef = useRef<HTMLDivElement>(document.createElement("div"));
  const popupInstanceRef = useRef<mapboxgl.Popup | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const contentEl = contentRef.current;
    if (!contentEl) return;
    markerRef.current = new mapboxgl.Marker({
      element: contentEl,
      anchor: "bottom",
    })
      .setLngLat([post.lng, post.lat])
      .addTo(map);

    popupInstanceRef.current = new mapboxgl.Popup({
      offset: 45,
      closeButton: false,
      anchor: "left",
      className:
        "[&_.mapboxgl-popup-tip]:hidden [&_.mapboxgl-popup-content]:!p-0",
    })
      .setLngLat([post.lng, post.lat])
      .setDOMContent(popupRef.current);

    const handleMarkerClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (isMobile) {
        NiceModal.show(RentalMarkerModal, { post });
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
  }, [isMobile, post, map]);

  const PropertyTypeIcon = getPropertyTypeIcon(post.propertyTypeKey);

  return (
    <>
      {createPortal(
        <div
          className={cn(
            "inline-flex items-center justify-center gap-1 px-2 py-1 bg-primary transition-all duration-300 rounded-full shadow-lg relative cursor-pointer hover:scale-110 hover:z-50 ring-2 ring-white",
            "before:content-[''] before:w-2 before:h-2 before:rotate-45 before:bg-primary before:absolute before:-bottom-1 before:left-1/2 before:-translate-x-1/2"
          )}
        >
          <PropertyTypeIcon className="text-white flex-shrink-0" size={14} />
          <span className="text-white text-xs font-bold leading-none">
            {formatVietnamCurrencyShort(post.price)}
          </span>
        </div>,
        contentRef.current!
      )}
      {/* popup */}
      {createPortal(
        <RentalMarkerPopup
          post={post}
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
  (prev, next) =>
    prev.post.id === next.post.id &&
    prev.post.propertyTypeKey === next.post.propertyTypeKey
);
