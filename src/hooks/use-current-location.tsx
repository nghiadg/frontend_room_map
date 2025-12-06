import { GEOLOCATION_CONFIG } from "@/app/map/constants";
import { Coordinates } from "@/types/location";
import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

type UseCurrentLocationOptions = {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  /** If true, will not automatically fetch location on mount */
  skipInitialFetch?: boolean;
  /** If true, will show toast on error (default: false) */
  showErrorToast?: boolean;
};

type UseCurrentLocationReturn = {
  location: Coordinates | null;
  isLoading: boolean;
  error: GeolocationPositionError | null;
  refetch: () => void;
};

export const useCurrentLocation = (
  options: UseCurrentLocationOptions = {}
): UseCurrentLocationReturn => {
  const t = useTranslations("map.location");
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<GeolocationPositionError | null>(null);
  const isMountedRef = useRef(true);

  // Destructure options with defaults to avoid object reference issues in deps
  const {
    enableHighAccuracy = GEOLOCATION_CONFIG.HIGH_ACCURACY,
    timeout = GEOLOCATION_CONFIG.TIMEOUT_MS,
    maximumAge = GEOLOCATION_CONFIG.MAX_AGE_MS,
    skipInitialFetch = false,
    showErrorToast = false,
  } = options;

  const fetchLocation = useCallback(() => {
    if (!navigator.geolocation) {
      if (showErrorToast) {
        toast.error(t("not_supported"));
      }
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Check if component is still mounted before updating state
        if (isMountedRef.current) {
          setLocation({
            lng: position.coords.longitude,
            lat: position.coords.latitude,
          });
          setIsLoading(false);
        }
      },
      (err) => {
        // Check if component is still mounted before updating state
        if (isMountedRef.current) {
          setError(err);
          setIsLoading(false);

          // Show toast based on error type
          if (showErrorToast) {
            switch (err.code) {
              case err.PERMISSION_DENIED:
                toast.error(t("permission_denied"));
                break;
              case err.POSITION_UNAVAILABLE:
                toast.error(t("unavailable"));
                break;
              case err.TIMEOUT:
                toast.error(t("timeout"));
                break;
              default:
                toast.error(t("error"));
            }
          }
        }
      },
      {
        enableHighAccuracy,
        timeout,
        maximumAge,
      }
    );
  }, [enableHighAccuracy, timeout, maximumAge, showErrorToast, t]);

  // Fetch location on mount (unless skipInitialFetch is true)
  useEffect(() => {
    isMountedRef.current = true;

    if (!skipInitialFetch) {
      fetchLocation();
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [fetchLocation, skipInitialFetch]);

  return { location, isLoading, error, refetch: fetchLocation };
};
