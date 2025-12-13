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
  /** Hết hạn - không hiển thị trên map, cần gia hạn */
  EXPIRED: "expired",
} as const;

export type PostStatus = (typeof POST_STATUS)[keyof typeof POST_STATUS];

/** Duration in days before a post expires */
export const POST_EXPIRATION_DAYS = 14;

/**
 * Check if a status is visible on the map
 */
export const isVisibleOnMap = (status: PostStatus): boolean => {
  return status === POST_STATUS.ACTIVE;
};

/**
 * Statuses that allow bumping (renewing) the post
 */
export const BUMPABLE_STATUSES: readonly PostStatus[] = [
  POST_STATUS.ACTIVE,
  POST_STATUS.HIDDEN,
  POST_STATUS.EXPIRED,
] as const;

/**
 * Check if a status allows bumping
 */
export const canBumpPost = (status: string): boolean => {
  return (BUMPABLE_STATUSES as readonly string[]).includes(status);
};

/**
 * Calculate new expiration date from now
 */
export const calculateNewExpiresAt = (): Date => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + POST_EXPIRATION_DAYS);
  return expiresAt;
};

/**
 * Statuses that should be shown in user's post management
 */
export const VISIBLE_STATUSES = [
  POST_STATUS.ACTIVE,
  POST_STATUS.HIDDEN,
  POST_STATUS.RENTED,
  POST_STATUS.EXPIRED,
] as const;
