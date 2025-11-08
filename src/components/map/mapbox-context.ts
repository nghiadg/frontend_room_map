import { createContext, useContext } from "react";

type MapBoxContextValue = {
  mapRef: React.RefObject<mapboxgl.Map | null>;
};

const MapBoxContext = createContext<MapBoxContextValue>({
  mapRef: { current: null },
});

export const MapBoxProvider = MapBoxContext.Provider;

export const useMapContext = () => {
  return useContext(MapBoxContext);
};
