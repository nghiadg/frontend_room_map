import { GEOLOCATION_CONFIG } from "@/app/map/constants";
import { useEffect, useState, useCallback, useRef } from "react";

type PermissionState = "prompt" | "granted" | "denied" | "unsupported";

type UseLocationPermissionReturn = {
  permissionState: PermissionState;
  isChecking: boolean;
  requestPermission: () => void;
};

/**
 * Hook to check and manage geolocation permission state.
 * Uses the Permissions API when available, with fallback for unsupported browsers.
 */
export const useLocationPermission = (): UseLocationPermissionReturn => {
  const [permissionState, setPermissionState] =
    useState<PermissionState>("prompt");
  const [isChecking, setIsChecking] = useState(true);
  const isMountedRef = useRef(true);

  // Check initial permission state
  useEffect(() => {
    isMountedRef.current = true;
    let permissionStatus: PermissionStatus | null = null;

    const handlePermissionChange = () => {
      if (isMountedRef.current && permissionStatus) {
        setPermissionState(permissionStatus.state as PermissionState);
      }
    };

    const checkPermission = async () => {
      // Check if geolocation is supported
      if (!navigator.geolocation) {
        if (isMountedRef.current) {
          setPermissionState("unsupported");
          setIsChecking(false);
        }
        return;
      }

      // Try to use the Permissions API if available
      if (navigator.permissions) {
        try {
          const result = await navigator.permissions.query({
            name: "geolocation",
          });

          permissionStatus = result;

          if (isMountedRef.current) {
            setPermissionState(result.state as PermissionState);
          }

          // Listen for permission changes
          result.addEventListener("change", handlePermissionChange);
        } catch {
          // Permissions API not supported for geolocation, default to prompt
          if (isMountedRef.current) {
            setPermissionState("prompt");
          }
        }
      }

      if (isMountedRef.current) {
        setIsChecking(false);
      }
    };

    checkPermission();

    // Cleanup: remove event listener and mark as unmounted
    return () => {
      isMountedRef.current = false;
      if (permissionStatus) {
        permissionStatus.removeEventListener("change", handlePermissionChange);
      }
    };
  }, []);

  // Request permission by triggering geolocation
  // Using low accuracy and cached position for faster permission prompt
  const requestPermission = useCallback(() => {
    if (!navigator.geolocation) {
      setPermissionState("unsupported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => {
        if (isMountedRef.current) {
          setPermissionState("granted");
        }
      },
      (error) => {
        if (isMountedRef.current && error.code === error.PERMISSION_DENIED) {
          setPermissionState("denied");
        }
      },
      {
        enableHighAccuracy: GEOLOCATION_CONFIG.LOW_ACCURACY,
        timeout: GEOLOCATION_CONFIG.TIMEOUT_MS,
        maximumAge: GEOLOCATION_CONFIG.MAX_AGE_PERMISSION,
      }
    );
  }, []);

  return { permissionState, isChecking, requestPermission };
};
