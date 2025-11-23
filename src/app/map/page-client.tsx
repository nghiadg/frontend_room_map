"use client";

import MapBox from "@/components/map/mapbox";
import RentalMarker from "@/components/rental-marker";
import { QUERY_KEYS } from "@/constants/query-keys";
import { useCurrentLocation } from "@/hooks/useCurrentLocation";
import { getPostsByMapBounds } from "@/services/client/posts";
import { Coordinates } from "@/types/location";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { debounce } from "lodash";
import { useEffect, useMemo, useRef, useState } from "react";

export default function MapPageClient() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const { location: currentLocation } = useCurrentLocation();
  const [mapBounds, setMapBounds] = useState<
    [Coordinates | null, Coordinates | null]
  >([null, null]);

  const { data: postsByMapBounds } = useQuery({
    queryKey: [QUERY_KEYS.POSTS_BY_MAP_BOUNDS, mapBounds[0], mapBounds[1]],
    queryFn: ({ queryKey: [, ne, sw] }) => {
      if (!ne || !sw) return null;
      return getPostsByMapBounds(ne as Coordinates, sw as Coordinates);
    },
    staleTime: 30_000,
    gcTime: 60_000,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

  const rentalMarkers = useMemo(() => {
    return postsByMapBounds?.map((post) => ({
      id: post.id,
      lng: post.lng,
      lat: post.lat,
    }));
  }, [postsByMapBounds]);

  useEffect(() => {
    if (!currentLocation) return;
    mapRef.current?.flyTo({
      center: [currentLocation.lng, currentLocation.lat],
      zoom: 13,
    });
  }, [currentLocation]);

  const debouncedGetPostsByBounds = useMemo(
    () =>
      debounce((mapInstance: mapboxgl.Map) => {
        const bounds = mapInstance?.getBounds();
        const ne = bounds?.getNorthEast();
        const sw = bounds?.getSouthWest();
        setMapBounds([ne as Coordinates, sw as Coordinates]);
      }, 500),
    []
  );

  useEffect(() => {
    if (!mapRef.current) return;
    const mapInstance = mapRef.current;
    const getPostsByBounds = () => {
      debouncedGetPostsByBounds(mapInstance);
    };
    mapInstance.on("moveend", getPostsByBounds);
    return () => {
      mapInstance.off("moveend", getPostsByBounds);
      debouncedGetPostsByBounds.cancel();
    };
  }, [debouncedGetPostsByBounds, mapRef]);

  return (
    <div className="h-full w-full">
      <MapBox
        ref={mapRef}
        initialLng={currentLocation?.lng}
        initialLat={currentLocation?.lat}
        initialZoom={13}
        wrapperClassName="h-full w-full"
      >
        {mapRef.current &&
          rentalMarkers?.map(({ lng, lat, id }) => (
            <RentalMarker key={id} map={mapRef.current!} lng={lng} lat={lat} />
          ))}
      </MapBox>
    </div>
  );
}
