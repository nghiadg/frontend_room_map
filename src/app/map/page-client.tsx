"use client";

import MapBox from "@/components/map/mapbox";
import RentalMarker from "@/components/rental-marker";
import { QUERY_KEYS } from "@/constants/query-keys";
import { QUERY_CONFIG } from "@/constants/query";
import { useCurrentLocation } from "@/hooks/useCurrentLocation";
import { getPostsByMapBounds } from "@/services/client/posts";
import { Coordinates } from "@/types/location";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { debounce } from "lodash";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import MapFilterButton from "./components/map-filter-button";
import { FilterValues } from "./components/map-filter-panel";
import { PropertyType } from "@/types/property-types";
import { Amenity } from "@/types/amenities";

type MapPageClientProps = {
  propertyTypes: PropertyType[];
  amenities: Amenity[];
};

export default function MapPageClient({
  propertyTypes,
  amenities,
}: MapPageClientProps) {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const { location: currentLocation } = useCurrentLocation();
  const [mapBounds, setMapBounds] = useState<
    [Coordinates | null, Coordinates | null]
  >([null, null]);

  // Filter state
  const [filters, setFilters] = useState<FilterValues>({
    minPrice: null,
    maxPrice: null,
    minArea: null,
    maxArea: null,
    propertyTypeIds: [],
    amenityIds: [],
  });

  const [appliedFilters, setAppliedFilters] = useState<FilterValues>(filters);

  const { data: postsByMapBounds } = useQuery({
    queryKey: [
      QUERY_KEYS.POSTS_BY_MAP_BOUNDS,
      mapBounds[0],
      mapBounds[1],
      appliedFilters,
    ],
    queryFn: ({ queryKey: [, ne, sw, filters] }) => {
      if (!ne || !sw) {
        return null;
      }

      return getPostsByMapBounds(
        ne as Coordinates,
        sw as Coordinates,
        filters as FilterValues
      );
    },
    staleTime: QUERY_CONFIG.MAP_POSTS_STALE_TIME,
    gcTime: QUERY_CONFIG.MAP_POSTS_GC_TIME,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

  const rentalMarkers = useMemo(() => {
    return postsByMapBounds?.map((post) => post);
  }, [postsByMapBounds]);

  useEffect(() => {
    if (!currentLocation) return;
    mapRef.current?.flyTo({
      center: [currentLocation.lng, currentLocation.lat],
      zoom: 13,
    });
  }, [currentLocation]);

  // Helper to extract and set map bounds from map instance
  const extractAndSetMapBounds = useCallback((mapInstance: mapboxgl.Map) => {
    const bounds = mapInstance.getBounds();
    const ne = bounds?.getNorthEast();
    const sw = bounds?.getSouthWest();
    setMapBounds([ne as Coordinates, sw as Coordinates]);
  }, []);

  const debouncedUpdateMapBounds = useMemo(
    () => debounce(extractAndSetMapBounds, QUERY_CONFIG.MAP_DEBOUNCE_MS),
    [extractAndSetMapBounds]
  );

  useEffect(() => {
    if (!mapRef.current) return;
    const mapInstance = mapRef.current;

    const updateMapBounds = () => {
      debouncedUpdateMapBounds(mapInstance);
    };

    const handleMapLoad = () => {
      extractAndSetMapBounds(mapInstance);
    };

    // Listen for both load (initial) and moveend (drag/zoom)
    mapInstance.on("load", handleMapLoad);
    mapInstance.on("moveend", updateMapBounds);

    return () => {
      mapInstance.off("load", handleMapLoad);
      mapInstance.off("moveend", updateMapBounds);
      debouncedUpdateMapBounds.cancel();
    };
  }, [debouncedUpdateMapBounds, extractAndSetMapBounds]);

  const handleApplyFilters = useCallback((newFilters: FilterValues) => {
    setAppliedFilters(newFilters);
  }, []);

  return (
    <div className="h-full w-full relative">
      <MapBox
        ref={mapRef}
        initialLng={currentLocation?.lng}
        initialLat={currentLocation?.lat}
        initialZoom={13}
        wrapperClassName="h-full w-full"
      >
        {mapRef.current &&
          rentalMarkers?.map((post) => (
            <RentalMarker key={post.id} map={mapRef.current!} post={post} />
          ))}
      </MapBox>

      <MapFilterButton
        filters={filters}
        onFiltersChange={setFilters}
        onApplyFilters={handleApplyFilters}
        propertyTypes={propertyTypes}
        amenities={amenities}
      />
    </div>
  );
}
