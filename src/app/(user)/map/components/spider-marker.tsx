"use client";

import { cn } from "@/lib/utils";
import { formatVietnamCurrencyShort } from "@/lib/utils/currency";
import { getPropertyTypeIconPath } from "@/lib/utils/property-type-icons";
import { PostMapMarker } from "@/services/client/posts";
import mapboxgl from "mapbox-gl";
import Image from "next/image";
import { memo, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import RentalMarkerPopup from "@/components/user/rental-marker-popup";
import { useIsMobile } from "@/hooks/use-mobile";
import NiceModal from "@ebay/nice-modal-react";
import { RentalMarkerModal } from "@/components/user/rental-marker-modal";

type SpiderMarkerProps = {
  post: PostMapMarker;
  map: mapboxgl.Map;
  /** Position offset from original for spider effect */
  position: [number, number];
};

/**
 * Marker component for spiderfied posts - NO arrow tip
 * Used when markers are expanded from a spider cluster
 */
function SpiderMarker({ map, post, position }: SpiderMarkerProps) {
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const contentRef = useRef<HTMLDivElement>(document.createElement("div"));
  const popupRef = useRef<HTMLDivElement>(document.createElement("div"));
  const popupInstanceRef = useRef<mapboxgl.Popup | null>(null);
  const isMobile = useIsMobile();

  const [lng, lat] = position;

  useEffect(() => {
    const contentEl = contentRef.current;
    if (!contentEl) return;

    markerRef.current = new mapboxgl.Marker({
      element: contentEl,
      anchor: "center", // Center anchor since no arrow
    })
      .setLngLat([lng, lat])
      .addTo(map);

    popupInstanceRef.current = new mapboxgl.Popup({
      offset: 50,
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
  }, [isMobile, post, map, lng, lat]);

  const iconPath = getPropertyTypeIconPath(post.propertyTypeKey);

  return (
    <>
      {createPortal(
        <div
          className={cn(
            "inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5",
            "bg-white",
            "rounded-full", // Rounded full, NO arrow
            "shadow-[0_4px_12px_rgba(0,0,0,0.25)]", // Stronger shadow for burst effect
            "cursor-pointer hover:scale-110 hover:z-50",
            "animate-[spider-pop-in_0.3s_ease-out_forwards]" // Pop-in animation
          )}
        >
          <Image
            src={iconPath}
            alt=""
            width={16}
            height={16}
            className="flex-shrink-0 rounded-full"
            aria-hidden="true"
          />
          <span className="text-gray-800 text-xs font-bold leading-none">
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
  SpiderMarker,
  (prev, next) =>
    prev.post.id === next.post.id &&
    prev.position[0] === next.position[0] &&
    prev.position[1] === next.position[1]
);
