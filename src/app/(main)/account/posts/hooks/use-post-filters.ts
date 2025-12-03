import { useState, useEffect, useMemo, useCallback } from "react";
import { isWithinInterval } from "date-fns";
import type { DateRange } from "react-day-picker";

// Constants
const DEBOUNCE_DELAY_MS = 500;
const POSTS_PER_PAGE = 9;

export type PostStatus = "active" | "pending" | "draft" | "expired" | "hidden";
export type SortValue = "newest" | "oldest" | "price_high" | "price_low";

export type PostFilters = {
  search: string;
  status: string;
  sortBy: SortValue;
  dateRange: DateRange | undefined;
};

type Post = {
  id: string;
  title: string;
  address: string;
  status: PostStatus;
  publishedAt: Date;
  price: number;
  deposit: number;
  area: number;
  propertyType: string;
  imageCount: number;
  thumbnail: string;
  statusLabel: string;
};

export type PaginationState = {
  currentPage: number;
  totalPages: number;
  postsPerPage: number;
  setCurrentPage: (page: number) => void;
};

export type UsePostFiltersReturn = {
  filters: PostFilters;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  setSearch: (search: string) => void;
  setStatus: (status: string) => void;
  setSortBy: (sortBy: SortValue) => void;
  setDateRange: (dateRange: DateRange | undefined) => void;
  hasActiveFilters: boolean;
  clearAllFilters: () => void;
};

export function usePostFilters(): UsePostFiltersReturn {
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortValue>("newest");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, DEBOUNCE_DELAY_MS);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter, sortBy, dateRange]);

  const hasActiveFilters =
    statusFilter !== "all" || debouncedSearch !== "" || dateRange !== undefined;

  const clearAllFilters = useCallback(() => {
    setSearchQuery("");
    setDebouncedSearch("");
    setStatusFilter("all");
    setDateRange(undefined);
    setSortBy("newest");
  }, []);

  // Memoize filters object to prevent infinite loop in useUserPosts
  const filters = useMemo(
    () => ({
      search: debouncedSearch,
      status: statusFilter,
      sortBy,
      dateRange,
    }),
    [debouncedSearch, statusFilter, sortBy, dateRange]
  );

  return {
    // Filter values (memoized)
    filters,

    // Pagination state (no totalPages - comes from API)
    currentPage,
    setCurrentPage,

    // Filter setters
    setSearch: setSearchQuery,
    setStatus: setStatusFilter,
    setSortBy,
    setDateRange,

    // Helpers
    hasActiveFilters,
    clearAllFilters,
  };
}
