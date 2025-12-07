/**
 * Calculates which page numbers should be visible in pagination controls.
 * Shows first page, last page, current page, and adjacent pages (±1).
 *
 * Example outputs:
 * - Total 5, Current 3: [1, 2, 3, 4, 5]
 * - Total 10, Current 5: [1, 4, 5, 6, 10]
 * - Total 20, Current 10: [1, 9, 10, 11, 20]
 *
 * @param currentPage - Current active page number (1-indexed)
 * @param totalPages - Total number of pages available
 * @returns Array of page numbers to display
 */
export function getVisiblePages(
  currentPage: number,
  totalPages: number
): number[] {
  const pages: number[] = [];

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 || // First page
      i === totalPages || // Last page
      Math.abs(i - currentPage) <= 1 // Adjacent to current page
    ) {
      pages.push(i);
    }
  }

  return pages;
}

/**
 * Checks if there should be an ellipsis between two page numbers.
 *
 * @param currentPageNumber - Current page number in iteration
 * @param previousPageNumber - Previous page number in iteration
 * @returns True if gap exists (should show ellipsis)
 */
export function shouldShowEllipsis(
  currentPageNumber: number,
  previousPageNumber: number | undefined
): boolean {
  if (previousPageNumber === undefined) return false;
  return currentPageNumber - previousPageNumber > 1;
}
