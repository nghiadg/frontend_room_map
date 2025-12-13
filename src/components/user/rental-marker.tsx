"use client";
import { cn } from "@/lib/utils";
import { formatVietnamCurrencyShort } from "@/lib/utils/currency";
import { getPropertyTypeIconPath } from "@/lib/utils/property-type-icons";
import { PostMapMarker } from "@/services/client/posts";
import mapboxgl from "mapbox-gl";
import Image from "next/image";
import { memo, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import RentalMarkerPopup from "./rental-marker-popup";
import { useIsMobile } from "@/hooks/use-mobile";
import NiceModal from "@ebay/nice-modal-react";
import { RentalMarkerModal } from "./rental-marker-modal";
import { trackSelectItem } from "@/lib/analytics";

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

      // Track marker click
      trackSelectItem({
        itemId: post.id,
        itemName: post.title,
        listName: "map_markers",
      });

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

  const iconPath = getPropertyTypeIconPath(post.propertyTypeKey);

  return (
    <>
      {createPortal(
        <div
          className={cn(
            "inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-white transition-all duration-300 rounded-full shadow-lg relative cursor-pointer hover:scale-110 hover:z-50"
          )}
        >
          <Image
            src={iconPath}
            alt=""
            width={18}
            height={18}
            className="flex-shrink-0 rounded-full"
            aria-hidden="true"
          />
          <span className="text-gray-800 text-xs font-bold leading-none">
            {formatVietnamCurrencyShort(post.price)}
          </span>
          {/* Arrow tip using SVG for smooth curves */}
          <svg
            className="absolute -bottom-1.5 left-1/2 -translate-x-1/2"
            width="12"
            height="6"
            viewBox="0 0 12 6"
            fill="none"
          >
            <path d="M6 6L0 0H12L6 6Z" fill="white" />
          </svg>
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
