"use client";

import { cn } from "@/lib/utils";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import MapFilterPanel, { FilterValues } from "./map-filter-panel";
import { useState, useMemo, useCallback } from "react";
import { PropertyType } from "@/types/property-types";
import { Amenity } from "@/types/amenities";
import { useIsMobile } from "@/hooks/use-mobile";
import { EMPTY_FILTERS } from "../constants";
import { useTranslations } from "next-intl";

type MapFilterButtonProps = {
  filters: FilterValues;
  onFiltersChange: (filters: FilterValues) => void;
  onApplyFilters: (filters: FilterValues) => void;
  propertyTypes: PropertyType[];
  amenities: Amenity[];
  className?: string;
};

export default function MapFilterButton({
  filters,
  onFiltersChange,
  onApplyFilters,
  propertyTypes,
  amenities,
  className,
}: MapFilterButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const t = useTranslations("filter");

  // Memoize expensive calculations
  const activeFilterCount = useMemo(
    () =>
      (filters.minPrice !== null ? 1 : 0) +
      (filters.maxPrice !== null ? 1 : 0) +
      (filters.minArea !== null ? 1 : 0) +
      (filters.maxArea !== null ? 1 : 0) +
      (filters.propertyTypeIds.length > 0 ? 1 : 0) +
      (filters.amenityIds.length > 0 ? 1 : 0),
    [filters]
  );

  const hasActiveFilters = activeFilterCount > 0;

  // Memoize callbacks to prevent unnecessary re-renders
  const handleApply = useCallback(
    (newFilters: FilterValues) => {
      onFiltersChange(newFilters);
      onApplyFilters(newFilters);
      setIsOpen(false);
    },
    [onFiltersChange, onApplyFilters]
  );

  const handleClear = useCallback(() => {
    onFiltersChange(EMPTY_FILTERS);
  }, [onFiltersChange]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Extract shared button component to eliminate duplication
  const FilterButton = useMemo(
    () => (
      <Button
        className={cn(
          "rounded-full shadow-lg transition-all duration-200 relative",
          hasActiveFilters && "bg-primary ring-2 ring-primary/50"
        )}
        aria-label={
          hasActiveFilters
            ? t("button.aria_label_with_count", { count: activeFilterCount })
            : t("button.label")
        }
      >
        <SlidersHorizontal className="h-5 w-5 mr-2" />
        {t("button.label")}
        {hasActiveFilters && (
          <span
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-bold animate-in zoom-in-50"
            aria-label={t("button.aria_active", { count: activeFilterCount })}
          >
            {activeFilterCount}
          </span>
        )}
      </Button>
    ),
    [hasActiveFilters, activeFilterCount, t]
  );

  // Extract shared panel props to eliminate duplication
  const filterPanelProps = useMemo(
    () => ({
      filters,
      onFiltersChange,
      onApply: handleApply,
      onClear: handleClear,
      onClose: handleClose,
      propertyTypes,
      amenities,
    }),
    [
      filters,
      onFiltersChange,
      handleApply,
      handleClear,
      handleClose,
      propertyTypes,
      amenities,
    ]
  );

  return (
    <div className={cn("fixed bottom-6 right-6 z-10", className)}>
      {isMobile ? (
        // Mobile: Bottom Sheet
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>{FilterButton}</SheetTrigger>
          <SheetContent
            side="bottom"
            className="p-0 [&>button]:hidden"
            aria-describedby="filter-description"
          >
            <span id="filter-description" className="sr-only">
              {t("button.aria_description")}
            </span>
            <MapFilterPanel {...filterPanelProps} />
          </SheetContent>
        </Sheet>
      ) : (
        // Desktop: Popover
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>{FilterButton}</PopoverTrigger>
          <PopoverContent
            side="top"
            align="end"
            className="w-80 p-0 shadow-xl"
            sideOffset={10}
            aria-describedby="filter-description"
          >
            <span id="filter-description" className="sr-only">
              {t("button.aria_description")}
            </span>
            <MapFilterPanel {...filterPanelProps} />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
