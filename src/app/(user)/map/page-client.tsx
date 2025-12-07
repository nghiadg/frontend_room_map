"use client";

import NiceModal from "@ebay/nice-modal-react";
import MapBox from "@/components/user/map/mapbox";
import Marker from "@/components/user/map/marker";
import RentalMarker from "@/components/user/rental-marker";
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
import ZoomWarning from "./components/zoom-warning";
import ClusterMarker from "./components/cluster-marker";
import { FilterValues } from "./components/map-filter-panel";
import { PropertyType } from "@/types/property-types";
import { Amenity } from "@/types/amenities";
import { EMPTY_FILTERS, MAP_CONFIG, VIETNAM_BOUNDS } from "./constants";
import { useClusters, ClusterOrPoint, isCluster } from "./hooks/use-clusters";

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

  // Track current zoom level for clustering
  const [currentZoom, setCurrentZoom] = useState<number>(
    MAP_CONFIG.INITIAL_ZOOM
  );

  // Determine if we should fetch posts based on zoom level
  const shouldFetchPosts = currentZoom >= MAP_CONFIG.MIN_ZOOM_FOR_MARKERS;

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
    // Only fetch when zoom level is sufficient
    enabled: shouldFetchPosts && mapBounds[0] !== null && mapBounds[1] !== null,
  });

  // Use clustering hook to group nearby markers
  const { clusters, supercluster } = useClusters({
    posts: postsByMapBounds ?? [],
    bounds: mapBounds,
    zoom: currentZoom,
  });

  // Fly to user location when it first becomes available
  useEffect(() => {
    if (!userLocation) return;
    mapRef.current?.flyTo({
      center: [userLocation.lng, userLocation.lat],
      zoom: MAP_CONFIG.INITIAL_ZOOM,
    });
  }, [userLocation]);

  // Helper to extract and set map bounds and zoom from map instance
  const extractAndSetMapState = useCallback((mapInstance: mapboxgl.Map) => {
    const bounds = mapInstance.getBounds();
    const ne = bounds?.getNorthEast();
    const sw = bounds?.getSouthWest();
    setMapBounds([ne as Coordinates, sw as Coordinates]);
    setCurrentZoom(mapInstance.getZoom());
  }, []);

  const debouncedUpdateMapState = useMemo(
    () => debounce(extractAndSetMapState, QUERY_CONFIG.MAP_DEBOUNCE_MS),
    [extractAndSetMapState]
  );

  useEffect(() => {
    if (!mapRef.current) return;
    const mapInstance = mapRef.current;

    const updateMapState = () => {
      debouncedUpdateMapState(mapInstance);
    };

    const handleMapLoad = () => {
      extractAndSetMapState(mapInstance);
    };

    // Listen for both load (initial) and moveend (drag/zoom)
    mapInstance.on("load", handleMapLoad);
    mapInstance.on("moveend", updateMapState);

    return () => {
      mapInstance.off("load", handleMapLoad);
      mapInstance.off("moveend", updateMapState);
      debouncedUpdateMapState.cancel();
    };
  }, [debouncedUpdateMapState, extractAndSetMapState]);

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

  // Handle cluster expansion - zoom in to show individual markers
  const handleClusterExpand = useCallback(
    (clusterId: number, lng: number, lat: number) => {
      if (!supercluster || !mapRef.current) return;

      const expansionZoom = Math.min(
        supercluster.getClusterExpansionZoom(clusterId),
        MAP_CONFIG.CLUSTER_MAX_ZOOM
      );

      mapRef.current.flyTo({
        center: [lng, lat],
        zoom: expansionZoom,
        duration: MAP_CONFIG.CLUSTER_EXPAND_DURATION_MS,
      });
    },
    [supercluster]
  );

  // Render cluster or individual marker based on type
  const renderClusterOrMarker = useCallback(
    (item: ClusterOrPoint) => {
      if (!mapRef.current) return null;

      const [lng, lat] = item.geometry.coordinates;

      // Check if it's a cluster using type guard
      if (isCluster(item)) {
        const { cluster_id, point_count } = item.properties;
        return (
          <ClusterMarker
            key={`cluster-${cluster_id}`}
            map={mapRef.current}
            lng={lng}
            lat={lat}
            pointCount={point_count}
            onExpand={() => handleClusterExpand(cluster_id, lng, lat)}
          />
        );
      }

      // Individual marker
      return (
        <RentalMarker
          key={`marker-${item.properties.id}`}
          map={mapRef.current}
          post={item.properties}
        />
      );
    },
    [handleClusterExpand]
  );

  return (
    <div className="h-full w-full relative">
      {/* Map Loading Overlay */}
      {!isMapLoaded && <MapLoading />}

      {/* Zoom Warning - show when zoomed out too far */}
      {isMapLoaded && !shouldFetchPosts && <ZoomWarning />}

      <MapBox
        ref={mapRef}
        initialLng={userLocation?.lng}
        initialLat={userLocation?.lat}
        initialZoom={MAP_CONFIG.INITIAL_ZOOM}
        maxBounds={VIETNAM_BOUNDS}
        wrapperClassName="h-full w-full"
        onMapReady={() => setIsMapLoaded(true)}
      >
        {/* Render clusters or individual markers */}
        {mapRef.current &&
          shouldFetchPosts &&
          clusters.map(renderClusterOrMarker)}

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
