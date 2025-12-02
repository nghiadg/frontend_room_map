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
  filteredPosts: Post[];
  paginatedPosts: Post[];
  filters: PostFilters;
  pagination: PaginationState;
  setSearch: (search: string) => void;
  setStatus: (status: string) => void;
  setSortBy: (sortBy: SortValue) => void;
  setDateRange: (dateRange: DateRange | undefined) => void;
  hasActiveFilters: boolean;
  clearAllFilters: () => void;
};

export function usePostFilters(posts: Post[]): UsePostFiltersReturn {
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

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    let filtered = [...posts];

    // Search filter
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.address.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((post) => post.status === statusFilter);
    }

    // Date range filter
    if (dateRange?.from) {
      filtered = filtered.filter((post) => {
        const from = dateRange.from!;
        if (!dateRange.to) {
          return post.publishedAt >= from;
        }
        return isWithinInterval(post.publishedAt, {
          start: from,
          end: dateRange.to,
        });
      });
    }

    // Sort - use spread to avoid mutation
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return b.publishedAt.getTime() - a.publishedAt.getTime();
        case "oldest":
          return a.publishedAt.getTime() - b.publishedAt.getTime();
        case "price_high":
          return b.price - a.price;
        case "price_low":
          return a.price - b.price;
        default:
          return 0;
      }
    });
  }, [posts, debouncedSearch, statusFilter, sortBy, dateRange]);

  // Calculate total pages and get paginated posts (combined for optimization)
  const { totalPages, paginatedPosts } = useMemo(() => {
    const total = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;

    return {
      totalPages: total,
      paginatedPosts: filteredPosts.slice(startIndex, endIndex),
    };
  }, [filteredPosts, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter, sortBy, dateRange]);

  // Clamp currentPage to valid range (edge case guard)
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    } else if (currentPage < 1) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const hasActiveFilters =
    statusFilter !== "all" || debouncedSearch !== "" || dateRange !== undefined;

  const clearAllFilters = useCallback(() => {
    setSearchQuery("");
    setDebouncedSearch("");
    setStatusFilter("all");
    setDateRange(undefined);
    setSortBy("newest");
  }, []);

  return {
    // Filtered data
    filteredPosts,
    paginatedPosts,

    // Filter values
    filters: {
      search: searchQuery,
      status: statusFilter,
      sortBy,
      dateRange,
    },

    // Pagination
    pagination: {
      currentPage,
      totalPages,
      postsPerPage: POSTS_PER_PAGE,
      setCurrentPage,
    },

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
