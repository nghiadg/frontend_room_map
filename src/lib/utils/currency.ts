/**
 * Currency formatting utilities for Vietnamese Dong (VND)
 * Using numeral.js for consistent number formatting
 */

import numeral from "numeral";

// Register Vietnamese locale for numeral
numeral.register("locale", "vi", {
  delimiters: {
    thousands: ",",
    decimal: ",",
  },
  abbreviations: {
    thousand: "k",
    million: "tr",
    billion: "tỷ",
    trillion: "tỷtỷ",
  },
  ordinal: function () {
    return "";
  },
  currency: {
    symbol: "đ",
  },
});

// Set Vietnamese as default locale
numeral.locale("vi");

/**
 * Formats a number as Vietnamese currency with full formatting
 * @param amount - Amount in VND
 * @returns Formatted string (e.g., "3,000,000đ")
 */
export function formatVietnamCurrency(amount: number): string {
  if (amount === 0) return "0đ";
  if (!amount || isNaN(amount)) return "N/A";

  return numeral(amount).format("0,0") + "đ";
}

/**
 * Formats a number as Vietnamese currency with unit suffix
 * @param amount - Amount in VND
 * @param unit - Unit suffix (e.g., "tháng", "m²")
 * @returns Formatted string (e.g., "3,000,000đ/tháng")
 */
export function formatCurrencyWithUnit(amount: number, unit: string): string {
  const formatted = formatVietnamCurrency(amount);
  return `${formatted}/${unit}`;
}

/**
 * Formats a number as short Vietnamese currency for compact display
 * Used for map markers and compact UI elements
 * @param amount - Amount in VND
 * @returns Formatted short string (e.g., "3tr", "500k", "1,5tr")
 */
export function formatVietnamCurrencyShort(amount: number): string {
  if (amount === 0) return "0đ";
  if (!amount || isNaN(amount)) return "N/A";

  const trillion = 1_000_000_000_000;
  const billion = 1_000_000_000;
  const million = 1_000_000;
  const thousand = 1_000;

  if (amount >= trillion) {
    return numeral(amount / trillion).format("0,0[.]0") + "tỷtỷ";
  }

  if (amount >= billion) {
    return numeral(amount / billion).format("0,0[.]0") + "tỷ";
  }

  if (amount >= million) {
    return numeral(amount / million).format("0,0[.]0") + "tr";
  }

  if (amount >= thousand) {
    return numeral(amount / thousand).format("0,0[.]0") + "k";
  }

  return `${amount}đ`;
}

/**
 * Formats a raw number with thousand separators
 * @param value - Number to format
 * @returns Formatted string (e.g., "1,234,567")
 */
export function formatNumber(value: number): string {
  if (!value || isNaN(value)) return "0";
  return numeral(value).format("0,0");
}

/**
 * Formats a complete address from location components
 * @param address - Street address
 * @param wardName - Ward name
 * @param districtName - District name
 * @param provinceName - Province name
 * @returns Formatted full address
 */
export function formatFullAddress(
  address: string,
  wardName?: string,
  districtName?: string,
  provinceName?: string
): string {
  const parts = [address, wardName, districtName, provinceName].filter(
    (part) => part && part.trim() !== ""
  );

  return parts.join(", ");
}
