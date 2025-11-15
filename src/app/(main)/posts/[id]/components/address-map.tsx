"use client";

import MapBox from "@/components/map/mapbox";
import MarkerDefault from "@/components/map/marker-default";
import { Button } from "@/components/ui/button";
import { District, Province, Ward } from "@/types/location";
import { MapIcon, MapPinIcon } from "lucide-react";
import { useRef } from "react";

type AddressMapProps = {
  province: Province;
  district: District;
  ward: Ward;
  address: string;
  lat: number;
  lng: number;
};

export default function AddressMap({
  province,
  district,
  ward,
  address,
  lat,
  lng,
}: AddressMapProps) {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const onClickGoogleMaps = () => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
      "_blank"
    );
  };
  return (
    <div className="py-6 lg:py-8" id="location">
      <h2 className="text-xl md:text-2xl font-semibold mb-6">Địa chỉ</h2>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <MapPinIcon className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
          <div>
            <p className="font-medium text-base mb-1">
              {ward.name}, {district.name}, {province.name}
            </p>
            <p className="text-sm text-muted-foreground">{address}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onClickGoogleMaps}>
          <MapIcon className="w-4 h-4" />
          Google Maps
        </Button>
      </div>

      <div className="h-[250px] lg:h-[400px] rounded-xl overflow-hidden bg-muted mt-4">
        <MapBox
          ref={mapRef}
          initialLng={lng}
          initialLat={lat}
          initialZoom={16}
          wrapperClassName="w-full h-full"
          interactive={false}
        >
          <MarkerDefault lng={lng} lat={lat} />
        </MapBox>
      </div>
    </div>
  );
}
