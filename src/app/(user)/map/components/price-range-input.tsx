import BaseRangeInput from "./base-range-input";
import { RangeValue, PresetRange } from "./types";
import { useTranslations } from "next-intl";

type PriceRangeInputProps = {
  minPrice: number | null;
  maxPrice: number | null;
  onMinPriceChange: (value: number | null) => void;
  onMaxPriceChange: (value: number | null) => void;
  onRangeChange?: (min: number | null, max: number | null) => void;
  className?: string;
};

/**
 * Price range input component using BaseRangeInput
 * Handles Vietnamese currency formatting
 */
export default function PriceRangeInput({
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  onRangeChange,
  className,
}: PriceRangeInputProps) {
  const t = useTranslations("filter.price");

  const PRESET_RANGES: PresetRange[] = [
    { label: t("presets.under_2m"), min: null, max: 2000000 },
    { label: t("presets.2m_5m"), min: 2000000, max: 5000000 },
    { label: t("presets.5m_10m"), min: 5000000, max: 10000000 },
    { label: t("presets.10m_15m"), min: 10000000, max: 15000000 },
    { label: t("presets.over_15m"), min: 15000000, max: null },
  ];

  const formatPrice = (value: RangeValue): string => {
    if (value === null) return "";
    return new Intl.NumberFormat("vi-VN").format(value);
  };

  const parsePrice = (input: string): RangeValue => {
    if (!input) return null;
    const numericValue = input.replace(/[^\d]/g, "");
    return numericValue ? parseInt(numericValue, 10) : null;
  };

  return (
    <BaseRangeInput
      min={minPrice}
      max={maxPrice}
      config={{
        minLabel: t("min_label"),
        maxLabel: t("max_label"),
        minPlaceholder: t("min_placeholder"),
        maxPlaceholder: t("max_placeholder"),
        unit: t("unit"),
        inputType: "text",
      }}
      callbacks={{
        onMinChange: onMinPriceChange,
        onMaxChange: onMaxPriceChange,
        onRangeChange,
      }}
      presetRanges={PRESET_RANGES}
      formatValue={formatPrice}
      parseValue={parsePrice}
      className={className}
    />
  );
}
