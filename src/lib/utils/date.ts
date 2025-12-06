/**
 * Date formatting utilities for consistent date display across the application.
 */

/**
 * Formats a date string or Date object to Vietnamese locale format (dd/mm/yyyy).
 * @param date - ISO date string or Date object
 * @param locale - Locale string, defaults to 'vi-VN'
 * @returns Formatted date string or empty string if invalid
 */
export function formatDate(
  date: string | Date | null | undefined,
  locale: string = "vi-VN"
): string {
  if (!date) return "";

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString(locale);
  } catch {
    return "";
  }
}

/**
 * Formats a date to relative time (e.g., "2 days ago", "1 week ago").
 * Falls back to formatted date if relative time is too long.
 * @param date - ISO date string or Date object
 * @param locale - Locale string, defaults to 'vi-VN'
 * @returns Relative time string or formatted date
 */
export function formatRelativeDate(
  date: string | Date | null | undefined,
  locale: string = "vi-VN"
): string {
  if (!date) return "";

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    // Use Intl.RelativeTimeFormat for proper localization
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

    if (diffDays === 0) {
      return rtf.format(0, "day"); // "today" or equivalent
    } else if (diffDays < 7) {
      return rtf.format(-diffDays, "day");
    } else if (diffDays < 30) {
      return rtf.format(-Math.floor(diffDays / 7), "week");
    } else if (diffDays < 365) {
      return rtf.format(-Math.floor(diffDays / 30), "month");
    } else {
      // Fall back to formatted date for very old dates
      return formatDate(dateObj, locale);
    }
  } catch {
    return formatDate(date, locale);
  }
}
