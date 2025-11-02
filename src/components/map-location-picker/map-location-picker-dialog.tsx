"use client";

import IconMarker from "@/components/icons/icon-marker";
import MapBox from "@/components/mapbox";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Coordinates } from "@/types/location";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

export const MapLocationPickerDialog = NiceModal.create(() => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [location, setLocation] = useState<Coordinates | null>(null);
  const modal = useModal();
  const t = useTranslations();

  const onMapReady = () => {
    const handleMove = () => {
      const center = mapRef.current?.getCenter();
      if (center) {
        setLocation({ lng: center.lng, lat: center.lat });
      }
    };

    mapRef.current?.on("moveend", handleMove);
  };

  const onConfirm = () => {
    if (location) {
      modal.resolve(location);
      modal.hide();
    }
  };

  useEffect(() => {
    if (!modal.visible) return;
    const timeout = setTimeout(() => {
      mapRef.current?.resize();
    }, 200);
    return () => clearTimeout(timeout);
  }, [modal.visible]);

  return (
    <Dialog open={modal.visible}>
      <DialogContent showCloseButton={false} className="lg:min-w-2xl">
        <DialogTitle>{t("common.select_location")}</DialogTitle>
        <DialogDescription>
          {t("common.select_location_description")}
        </DialogDescription>
        <div className="w-full h-96 relative rounded-md overflow-hidden">
          <MapBox
            ref={mapRef}
            initialZoom={13}
            wrapperClassName="h-full w-full"
            onMapReady={onMapReady}
          />
          <IconMarker className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <DialogFooter>
          <Button onClick={onConfirm} variant="default">
            {t("common.confirm")}
          </Button>
          <Button onClick={modal.hide} variant="outline">
            {t("common.cancel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
