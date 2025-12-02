import { useState, useEffect, useMemo, useCallback } from "react";
import { isWithinInterval } from "date-fns";
import type { DateRange } from "react-day-picker";

// Constants
const DEBOUNCE_DELAY_MS = 500;

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

export function usePostFilters(posts: Post[]) {
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortValue>("newest");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

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

    // Sort
    filtered.sort((a, b) => {
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

    return filtered;
  }, [posts, debouncedSearch, statusFilter, sortBy, dateRange]);

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

    // Filter values
    filters: {
      search: searchQuery,
      status: statusFilter,
      sortBy,
      dateRange,
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
