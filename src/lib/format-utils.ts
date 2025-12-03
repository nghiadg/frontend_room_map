/**
 * Format utilities for numbers, currency, and prices
 */

const MILLION = 1_000_000;

/**
 * Format a number in millions with Vietnamese decimal separator
 * @param value - The number to format
 * @returns Formatted string (e.g., "3,5" for 3.5 million)
 * @example
 * formatMillions(3500000) // "3,5"
 * formatMillions(11000000) // "11,0"
 */
export const formatMillions = (value: number): string => {
  return (value / MILLION).toFixed(1).replace(".", ",");
};

/**
 * Format a price with Vietnamese thousand separator
 * @param value - The price value
 * @returns Formatted string with thousand separators (e.g., "3.500.000")
 * @example
 * formatPrice(3500000) // "3.500.000"
 */
export const formatPrice = (value: number): string => {
  return value.toLocaleString("vi-VN");
};

/**
 * Constants for common thresholds
 */
export const MIN_IMAGE_COUNT = 3;
