/**
 * Format utilities for numbers, currency, and prices
 */

const MILLION = 1_000_000;
const LOCALE_VI_VN = "vi-VN";

/**
 * Smart price format result type
 */
export type SmartPriceResult = {
  value: string;
  unit: "million" | "dong";
};

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
 * Smart price formatter - automatically chooses appropriate unit based on value
 * @param value - The price value in VND
 * @returns Object with formatted value and unit type
 * @example
 * formatSmartPrice(3500000) // { value: "3,5", unit: "million" }
 * formatSmartPrice(500000)  // { value: "500.000", unit: "dong" }
 */
export const formatSmartPrice = (value: number): SmartPriceResult => {
  if (value >= MILLION) {
    return {
      value: formatMillions(value),
      unit: "million",
    };
  }
  return {
    value: value.toLocaleString(LOCALE_VI_VN),
    unit: "dong",
  };
};

/**
 * Format a price with Vietnamese thousand separator
 * @param value - The price value
 * @returns Formatted string with thousand separators (e.g., "3.500.000")
 * @example
 * formatPrice(3500000) // "3.500.000"
 */
export const formatPrice = (value: number): string => {
  return value.toLocaleString(LOCALE_VI_VN);
};

/**
 * Constants for common thresholds
 */
export const MIN_IMAGE_COUNT = 3;
