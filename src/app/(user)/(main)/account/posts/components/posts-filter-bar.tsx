"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";
import { DateRangePicker } from "@/components/user/date-range-picker";
import { useTranslations } from "next-intl";
import type { SortValue, PostFilters } from "../hooks/use-post-filters";
import type { DateRange } from "react-day-picker";
import { useState, useEffect } from "react";

type PostsFilterBarProps = {
  filters: PostFilters;
  onSearchChange: (search: string) => void;
  onStatusChange: (status: string) => void;
  onSortByChange: (sortBy: SortValue) => void;
  onDateRangeChange: (dateRange: DateRange | undefined) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  resultsCount: number;
};

export function PostsFilterBar({
  filters,
  onSearchChange,
  onStatusChange,
  onSortByChange,
  onDateRangeChange,
  hasActiveFilters,
  onClearFilters,
  resultsCount,
}: PostsFilterBarProps) {
  const t = useTranslations();

  // Local state for immediate input updates (prevents lag when typing)
  const [localSearch, setLocalSearch] = useState(filters.search);

  // Sync local state when filters.search changes (from clear filters, etc.)
  useEffect(() => {
    setLocalSearch(filters.search);
  }, [filters.search]);

  const handleSearchChange = (value: string) => {
    setLocalSearch(value); // Update input immediately
    onSearchChange(value); // Trigger debounced API call
  };

  const statusFilters = [
    { label: t("posts.manage.status_filter.all"), value: "all" },
    { label: t("posts.manage.status_filter.active"), value: "active" },
    { label: t("posts.manage.status_filter.hidden"), value: "hidden" },
    { label: t("posts.manage.status_filter.rented"), value: "rented" },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Filter Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <Input
            placeholder={t("posts.manage.search_placeholder")}
            value={localSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>

        {/* Status Filter */}
        <Select value={filters.status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusFilters.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort Dropdown */}
        <Select
          value={filters.sortBy}
          onValueChange={(v) => onSortByChange(v as SortValue)}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder={t("posts.manage.sort.label")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">
              {t("posts.manage.sort.newest")}
            </SelectItem>
            <SelectItem value="oldest">
              {t("posts.manage.sort.oldest")}
            </SelectItem>
            <SelectItem value="price_high">
              {t("posts.manage.sort.price_high")}
            </SelectItem>
            <SelectItem value="price_low">
              {t("posts.manage.sort.price_low")}
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Date Range Picker */}
        <DateRangePicker
          selected={filters.dateRange}
          onSelect={onDateRangeChange}
          placeholder={t("posts.manage.date_range.label")}
          className="w-full sm:w-[260px]"
        />
      </div>

      {/* Results Count & Clear Filters */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {t("posts.manage.results_count", { count: resultsCount })}
        </span>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-8"
          >
            {t("posts.manage.clear_filters")}
          </Button>
        )}
      </div>
    </div>
  );
}
