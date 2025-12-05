import { Coordinates } from "@/types/location";
import { useEffect, useState } from "react";

export const useCurrentLocation = () => {
  const [location, setLocation] = useState<Coordinates | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          lng: position.coords.longitude,
          lat: position.coords.latitude,
        });
      });
    }
  }, []);

  return { location, setLocation };
};
