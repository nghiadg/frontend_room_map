"use client";

import MapBox from "@/components/user/map/mapbox";
import MarkerDefault from "@/components/user/map/marker-default";
import { Button } from "@/components/ui/button";
import { District, Province, Ward } from "@/types/location";
import { CheckIcon, CopyIcon, MapIcon, MapPinIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";

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
  const t = useTranslations();
  const [copied, setCopied] = useState(false);

  const fullAddress = `${address}, ${ward.name}, ${district.name}, ${province.name}`;

  const onClickGoogleMaps = () => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
      "_blank"
    );
  };

  const onClickCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(fullAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy address:", err);
    }
  };

  return (
    <div className="py-6 lg:py-8" id="location">
      <h2 className="text-xl md:text-2xl font-semibold mb-6">
        {t("posts.details.address")}
      </h2>
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
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClickCopyAddress}
            aria-label={t("posts.details.copy_address")}
          >
            {copied ? (
              <>
                <CheckIcon className="w-4 h-4 text-green-500" />
                {t("posts.details.copied")}
              </>
            ) : (
              <>
                <CopyIcon className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {t("posts.details.copy_address")}
                </span>
              </>
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={onClickGoogleMaps}>
            <MapIcon className="w-4 h-4" />
            {t("posts.details.google_maps")}
          </Button>
        </div>
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
