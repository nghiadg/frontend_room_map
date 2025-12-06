import { FilterValues } from "./components/map-filter-panel";

// Shared empty filter state constant
export const EMPTY_FILTERS: FilterValues = {
  minPrice: null,
  maxPrice: null,
  minArea: null,
  maxArea: null,
  propertyTypeIds: [],
  amenityIds: [],
};

// Map zoom and animation constants
export const MAP_CONFIG = {
  /** Zoom level when centering on user location */
  LOCATE_ZOOM: 15,
  /** Initial map zoom level */
  INITIAL_ZOOM: 13,
  /** Duration of flyTo animation in ms */
  FLY_DURATION_MS: 1500,
} as const;

// Geolocation API configuration
export const GEOLOCATION_CONFIG = {
  /** Use high accuracy GPS (slower but more precise) */
  HIGH_ACCURACY: true,
  /** Low accuracy for permission requests (faster) */
  LOW_ACCURACY: false,
  /** Timeout for geolocation request in ms */
  TIMEOUT_MS: 10000,
  /** Maximum age of cached position in ms (0 = always fresh) */
  MAX_AGE_MS: 0,
  /** Maximum age for permission requests (use cached if available) */
  MAX_AGE_PERMISSION: Infinity,
} as const;
