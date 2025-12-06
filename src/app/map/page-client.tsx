"use client";

import NiceModal from "@ebay/nice-modal-react";
import MapBox from "@/components/map/mapbox";
import Marker from "@/components/map/marker";
import RentalMarker from "@/components/rental-marker";
import { QUERY_KEYS } from "@/constants/query-keys";
import { QUERY_CONFIG } from "@/constants/query";
import { useCurrentLocation } from "@/hooks/use-current-location";
import { useLocationPermission } from "@/hooks/use-location-permission";
import { getPostsByMapBounds } from "@/services/client/posts";
import { Coordinates } from "@/types/location";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { debounce } from "lodash";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import MapFilterButton from "./components/map-filter-button";
import MyLocationButton from "./components/my-location-button";
import UserLocationMarker from "./components/user-location-marker";
import LocationPermissionDialog from "./components/location-permission-dialog";
import LocationDeniedDialog from "./components/location-denied-dialog";
import MapLoading from "./components/map-loading";
import { FilterValues } from "./components/map-filter-panel";
import { PropertyType } from "@/types/property-types";
import { Amenity } from "@/types/amenities";
import { EMPTY_FILTERS, MAP_CONFIG } from "./constants";

type MapPageClientProps = {
  propertyTypes: PropertyType[];
  amenities: Amenity[];
};

export default function MapPageClient({
  propertyTypes,
  amenities,
}: MapPageClientProps) {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Permission state - check first before triggering geolocation
  const { permissionState, isChecking, requestPermission } =
    useLocationPermission();
  const [hasRequestedPermission, setHasRequestedPermission] = useState(false);

  // Skip initial fetch - we'll manually trigger it after permission check
  const {
    location: userLocation,
    isLoading: isLocating,
    refetch: refetchLocation,
  } = useCurrentLocation({ skipInitialFetch: true, showErrorToast: true });

  const [mapBounds, setMapBounds] = useState<
    [Coordinates | null, Coordinates | null]
  >([null, null]);

  // Filter state
  const [filters, setFilters] = useState<FilterValues>(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<FilterValues>(filters);

  // Permission dialog handlers
  const handleAllowPermission = useCallback(() => {
    setHasRequestedPermission(true);
    requestPermission();
  }, [requestPermission]);

  const handleDenyPermission = useCallback(() => {
    setHasRequestedPermission(true);
  }, []);

  // Show permission dialog when permission state is "prompt"
  useEffect(() => {
    if (
      !isChecking &&
      permissionState === "prompt" &&
      !hasRequestedPermission
    ) {
      NiceModal.show(LocationPermissionDialog, {
        onAllow: handleAllowPermission,
        onDeny: handleDenyPermission,
      });
    }
  }, [
    isChecking,
    permissionState,
    hasRequestedPermission,
    handleAllowPermission,
    handleDenyPermission,
  ]);

  // Auto-fetch location when permission is already granted
  useEffect(() => {
    if (!isChecking && permissionState === "granted") {
      refetchLocation();
    }
  }, [isChecking, permissionState, refetchLocation]);

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

  // Fly to user location when it first becomes available
  useEffect(() => {
    if (!userLocation) return;
    mapRef.current?.flyTo({
      center: [userLocation.lng, userLocation.lat],
      zoom: MAP_CONFIG.INITIAL_ZOOM,
    });
  }, [userLocation]);

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

  // Handle locate button click - refetch location and fly to it
  const handleLocate = useCallback(() => {
    // If permission denied, show the denied dialog
    if (permissionState === "denied") {
      NiceModal.show(LocationDeniedDialog);
      return;
    }

    // If permission not yet granted, show request dialog
    if (permissionState === "prompt") {
      NiceModal.show(LocationPermissionDialog, {
        onAllow: handleAllowPermission,
        onDeny: handleDenyPermission,
      });
      return;
    }

    refetchLocation();

    // Fly to current location if available
    if (userLocation) {
      mapRef.current?.flyTo({
        center: [userLocation.lng, userLocation.lat],
        zoom: MAP_CONFIG.LOCATE_ZOOM,
        duration: MAP_CONFIG.FLY_DURATION_MS,
      });
    }
  }, [
    permissionState,
    refetchLocation,
    userLocation,
    handleAllowPermission,
    handleDenyPermission,
  ]);

  return (
    <div className="h-full w-full relative">
      {/* Map Loading Overlay */}
      {!isMapLoaded && <MapLoading />}

      <MapBox
        ref={mapRef}
        initialLng={userLocation?.lng}
        initialLat={userLocation?.lat}
        initialZoom={MAP_CONFIG.INITIAL_ZOOM}
        wrapperClassName="h-full w-full"
        onMapReady={() => setIsMapLoaded(true)}
      >
        {mapRef.current &&
          rentalMarkers?.map((post) => (
            <RentalMarker key={post.id} map={mapRef.current!} post={post} />
          ))}

        {/* User location marker */}
        {userLocation && (
          <Marker
            lng={userLocation.lng}
            lat={userLocation.lat}
            anchor="center"
            element={<UserLocationMarker />}
          />
        )}
      </MapBox>

      {/* Map Controls */}
      <div className="fixed bottom-6 right-6 z-10 flex flex-col gap-3 items-end">
        <MyLocationButton onLocate={handleLocate} isLocating={isLocating} />
        <MapFilterButton
          filters={filters}
          onFiltersChange={setFilters}
          onApplyFilters={handleApplyFilters}
          propertyTypes={propertyTypes}
          amenities={amenities}
          className="static"
        />
      </div>
    </div>
  );
}
