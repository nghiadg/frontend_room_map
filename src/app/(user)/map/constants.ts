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
  LOCATE_ZOOM: 17,
  /** Initial map zoom level */
  INITIAL_ZOOM: 13,
  /** Duration of flyTo animation in ms */
  FLY_DURATION_MS: 1500,
  /** Duration of cluster expand animation in ms */
  CLUSTER_EXPAND_DURATION_MS: 500,
  /** Minimum zoom level to fetch and display markers (below this shows warning) */
  MIN_ZOOM_FOR_MARKERS: 12,
  /** Cluster radius in pixels - how close markers need to be to cluster */
  CLUSTER_RADIUS: 40,
  /** Max zoom level where clusters still appear (above this shows individual markers) */
  CLUSTER_MAX_ZOOM: 14,
  /** Minimum size of cluster marker in pixels */
  CLUSTER_MARKER_MIN_SIZE: 48,
  /** Maximum size of cluster marker in pixels */
  CLUSTER_MARKER_MAX_SIZE: 72,
  /** Scale factor for cluster marker size based on point count */
  CLUSTER_MARKER_SCALE_FACTOR: 5,
  /** Divisor for calculating cluster marker growth */
  CLUSTER_MARKER_SCALE_DIVISOR: 10,
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

// Vietnam geographic bounds - restrict map panning to Vietnam only
export const VIETNAM_BOUNDS: [[number, number], [number, number]] = [
  // Southwest corner [lng, lat] - Near Ca Mau
  [101.0, 7.5],
  // Northeast corner [lng, lat] - Near Ha Giang
  [110.0, 24.0],
];
