"use client";

import { Amenity } from "@/types/amenities";
import { PropertyType } from "@/types/property-types";
import FilterSection from "./filter-section";
import PriceRangeInput from "./price-range-input";
import AreaRangeInput from "./area-range-input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { X } from "lucide-react";
import { EMPTY_FILTERS } from "../constants";
import { useTranslations } from "next-intl";
import { trackSearch } from "@/lib/analytics";

export type FilterValues = {
  minPrice: number | null;
  maxPrice: number | null;
  minArea: number | null;
  maxArea: number | null;
  propertyTypeIds: number[];
  amenityIds: number[];
};

type MapFilterPanelProps = {
  filters: FilterValues;
  onFiltersChange: (filters: FilterValues) => void;
  onApply: (filters: FilterValues) => void;
  onClear: () => void;
  onClose?: () => void;
  propertyTypes?: PropertyType[];
  amenities?: Amenity[];
  className?: string;
};

// Extracted skeleton loading component
const SkeletonList = memo(({ count }: { count: number }) => (
  <div className="space-y-2">
    {Array.from({ length: count }, (_, i) => (
      <Skeleton key={i} className="h-5 w-full" />
    ))}
  </div>
));
SkeletonList.displayName = "SkeletonList";

// Extracted checkbox item to avoid inline callbacks
type FilterCheckboxItemProps = {
  id: string;
  label: string;
  checked: boolean;
  onToggle: () => void;
};

const FilterCheckboxItem = memo(
  ({ id, label, checked, onToggle }: FilterCheckboxItemProps) => (
    <div className="flex items-center space-x-2">
      <Checkbox id={id} checked={checked} onCheckedChange={onToggle} />
      <Label htmlFor={id} className="text-sm font-normal cursor-pointer">
        {label}
      </Label>
    </div>
  )
);
FilterCheckboxItem.displayName = "FilterCheckboxItem";

export default function MapFilterPanel({
  filters,
  onFiltersChange,
  onApply,
  onClear,
  onClose,
  propertyTypes = [],
  amenities = [],
  className,
}: MapFilterPanelProps) {
  const t = useTranslations("filter");

  // Local state for pending filter changes
  const [localFilters, setLocalFilters] = useState<FilterValues>(filters);

  // Sync local filters with parent filters when they change externally (e.g., clear)
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Memoize callbacks to prevent unnecessary re-renders
  const handlePropertyTypeToggle = useCallback((propertyTypeId: number) => {
    setLocalFilters((prev) => ({
      ...prev,
      propertyTypeIds: prev.propertyTypeIds.includes(propertyTypeId)
        ? prev.propertyTypeIds.filter((id) => id !== propertyTypeId)
        : [...prev.propertyTypeIds, propertyTypeId],
    }));
  }, []);

  const handleAmenityToggle = useCallback((amenityId: number) => {
    setLocalFilters((prev) => ({
      ...prev,
      amenityIds: prev.amenityIds.includes(amenityId)
        ? prev.amenityIds.filter((id) => id !== amenityId)
        : [...prev.amenityIds, amenityId],
    }));
  }, []);

  const handleMinPriceChange = useCallback((value: number | null) => {
    setLocalFilters((prev) => ({ ...prev, minPrice: value }));
  }, []);

  const handleMaxPriceChange = useCallback((value: number | null) => {
    setLocalFilters((prev) => ({ ...prev, maxPrice: value }));
  }, []);

  const handlePriceRangeChange = useCallback(
    (min: number | null, max: number | null) => {
      setLocalFilters((prev) => ({ ...prev, minPrice: min, maxPrice: max }));
    },
    []
  );

  const handleMinAreaChange = useCallback((value: number | null) => {
    setLocalFilters((prev) => ({ ...prev, minArea: value }));
  }, []);

  const handleMaxAreaChange = useCallback((value: number | null) => {
    setLocalFilters((prev) => ({ ...prev, maxArea: value }));
  }, []);

  const handleAreaRangeChange = useCallback(
    (min: number | null, max: number | null) => {
      setLocalFilters((prev) => ({ ...prev, minArea: min, maxArea: max }));
    },
    []
  );

  const handleApply = useCallback(() => {
    // Track search/filter action
    trackSearch({
      filters: {
        min_price: localFilters.minPrice,
        max_price: localFilters.maxPrice,
        min_area: localFilters.minArea,
        max_area: localFilters.maxArea,
        property_types: localFilters.propertyTypeIds.length,
        amenities: localFilters.amenityIds.length,
      },
    });
    onApply(localFilters);
  }, [onApply, localFilters]);

  const handleClear = useCallback(() => {
    setLocalFilters(EMPTY_FILTERS);
    onClear();
  }, [onClear]);

  const hasActiveFilters = useMemo(
    () =>
      localFilters.minPrice !== null ||
      localFilters.maxPrice !== null ||
      localFilters.minArea !== null ||
      localFilters.maxArea !== null ||
      localFilters.propertyTypeIds.length > 0 ||
      localFilters.amenityIds.length > 0,
    [localFilters]
  );

  return (
    <div className={className}>
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold text-base">{t("panel.title")}</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-accent transition-colors"
            aria-label={t("panel.close")}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="px-4 max-h-[calc(80vh-10rem)] overflow-y-auto">
        {/* Price Range Filter */}
        <FilterSection title={t("panel.sections.price")}>
          <PriceRangeInput
            minPrice={localFilters.minPrice}
            maxPrice={localFilters.maxPrice}
            onMinPriceChange={handleMinPriceChange}
            onMaxPriceChange={handleMaxPriceChange}
            onRangeChange={handlePriceRangeChange}
          />
        </FilterSection>

        {/* Area Range Filter */}
        <FilterSection title={t("panel.sections.area")}>
          <AreaRangeInput
            minArea={localFilters.minArea}
            maxArea={localFilters.maxArea}
            onMinAreaChange={handleMinAreaChange}
            onMaxAreaChange={handleMaxAreaChange}
            onRangeChange={handleAreaRangeChange}
          />
        </FilterSection>

        {/* Property Type Filter */}
        <FilterSection title={t("panel.sections.property_type")}>
          {propertyTypes.length === 0 ? (
            <SkeletonList count={3} />
          ) : (
            <div className="space-y-2">
              {propertyTypes.map((propertyType) => (
                <FilterCheckboxItem
                  key={propertyType.id}
                  id={`property-type-${propertyType.id}`}
                  label={propertyType.name}
                  checked={localFilters.propertyTypeIds.includes(
                    propertyType.id
                  )}
                  onToggle={() => handlePropertyTypeToggle(propertyType.id)}
                />
              ))}
            </div>
          )}
        </FilterSection>

        {/* Amenities Filter */}
        <FilterSection title={t("panel.sections.amenities")}>
          {amenities.length === 0 ? (
            <SkeletonList count={4} />
          ) : (
            <div className="space-y-2">
              {amenities.map((amenity) => (
                <FilterCheckboxItem
                  key={amenity.id}
                  id={`amenity-${amenity.id}`}
                  label={amenity.name}
                  checked={localFilters.amenityIds.includes(amenity.id)}
                  onToggle={() => handleAmenityToggle(amenity.id)}
                />
              ))}
            </div>
          )}
        </FilterSection>
      </div>

      {/* Action Buttons - Sticky at bottom */}
      <div className="sticky bottom-0 bg-background px-4 py-3 border-t border-border flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleClear}
          disabled={!hasActiveFilters}
          className="flex-1"
        >
          {t("panel.actions.clear")}
        </Button>
        <Button size="sm" onClick={handleApply} className="flex-1">
          {t("panel.actions.apply")}
        </Button>
      </div>
    </div>
  );
}
