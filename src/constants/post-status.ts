/**
 * Post status constants
 * Used for filtering and displaying post visibility states
 */
export const POST_STATUS = {
  /** Đang cho thuê - hiển thị trên map */
  ACTIVE: "active",
  /** Tạm ẩn - không hiển thị trên map */
  HIDDEN: "hidden",
  /** Đã cho thuê - không hiển thị trên map */
  RENTED: "rented",
  /** Đã xóa (soft delete) - không hiển thị */
  DELETED: "deleted",
} as const;

export type PostStatus = (typeof POST_STATUS)[keyof typeof POST_STATUS];

/**
 * Check if a status is visible on the map
 */
export const isVisibleOnMap = (status: PostStatus): boolean => {
  return status === POST_STATUS.ACTIVE;
};

/**
 * Statuses that should be shown in user's post management
 */
export const VISIBLE_STATUSES = [
  POST_STATUS.ACTIVE,
  POST_STATUS.HIDDEN,
  POST_STATUS.RENTED,
] as const;
