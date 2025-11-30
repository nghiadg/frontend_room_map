/**
 * Query configuration constants for React Query
 * Centralizes timing and performance settings
 */
export const QUERY_CONFIG = {
  /**
   * Time in milliseconds before cached data is considered stale
   * Map posts data is relatively stable within a short time window
   */
  MAP_POSTS_STALE_TIME: 30_000, // 30 seconds

  /**
   * Time in milliseconds before garbage collection removes unused cache
   * Keeps data in memory for a reasonable time for back/forward navigation
   */
  MAP_POSTS_GC_TIME: 60_000, // 60 seconds

  /**
   * Debounce delay for map movement events
   * Prevents excessive API calls during map panning/zooming
   */
  MAP_DEBOUNCE_MS: 500, // 500ms
} as const;
