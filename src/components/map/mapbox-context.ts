import { createContext, useContext } from "react";

type MapBoxContextValue = {
  mapRef: React.RefObject<mapboxgl.Map | null>;
  isMapReady: boolean;
};

const MapBoxContext = createContext<MapBoxContextValue>({
  mapRef: { current: null },
  isMapReady: false,
});

export const MapBoxProvider = MapBoxContext.Provider;

export const useMapContext = () => {
  return useContext(MapBoxContext);
};
