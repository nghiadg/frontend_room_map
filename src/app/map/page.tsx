"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import MapBox from "../../components/mapbox";
import RentalMarker from "@/components/rental-marker";
import RentalMarkerPopup from "@/components/rental-marker-popup";

export default function MapPage() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [rentalMarker, setRentalMarker] = useState<
    Array<{
      lng: number;
      lat: number;
    }>
  >([{ lng: 106.6667, lat: 10.75 }]);

  const loadMarker = useCallback(async () => {
    await setTimeout(() => {
      setRentalMarker([
        { lng: 106.6667, lat: 10.75 },
        { lng: 106.66695, lat: 10.7502 },
        { lng: 106.6767, lat: 10.755 },
      ]);
    }, 1000);
  }, []);

  useEffect(() => {
    loadMarker();
  }, [loadMarker]);

  return (
    <div className="h-full w-full">
      <MapBox
        ref={mapRef}
        initialLng={106.6667}
        initialLat={10.75}
        initialZoom={13}
        wrapperClassName="h-full w-full"
      >
        {mapRef.current &&
          rentalMarker.map((marker) => (
            <RentalMarker
              key={marker.lng + marker.lat}
              map={mapRef.current!}
              lng={marker.lng}
              lat={marker.lat}
              popupContent={<RentalMarkerPopup />}
            />
          ))}
      </MapBox>
    </div>
  );
}
