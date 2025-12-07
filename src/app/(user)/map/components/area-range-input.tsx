import BaseRangeInput from "./base-range-input";
import { RangeValue, PresetRange } from "./types";
import { useTranslations } from "next-intl";

type AreaRangeInputProps = {
  minArea: number | null;
  maxArea: number | null;
  onMinAreaChange: (value: number | null) => void;
  onMaxAreaChange: (value: number | null) => void;
  onRangeChange?: (min: number | null, max: number | null) => void;
  className?: string;
};

/**
 * Area range input component using BaseRangeInput
 * Handles area measurements in square meters
 */
export default function AreaRangeInput({
  minArea,
  maxArea,
  onMinAreaChange,
  onMaxAreaChange,
  onRangeChange,
  className,
}: AreaRangeInputProps) {
  const t = useTranslations("filter.area");

  const PRESET_RANGES: PresetRange[] = [
    { label: t("presets.under_20"), min: null, max: 20 },
    { label: t("presets.20_30"), min: 20, max: 30 },
    { label: t("presets.30_50"), min: 30, max: 50 },
    { label: t("presets.50_70"), min: 50, max: 70 },
    { label: t("presets.over_70"), min: 70, max: null },
  ];

  const formatArea = (value: RangeValue): string => {
    if (value === null) return "";
    return value.toString();
  };

  const parseArea = (input: string): RangeValue => {
    if (!input) return null;
    const numericValue = parseFloat(input);
    return isNaN(numericValue) ? null : numericValue;
  };

  return (
    <BaseRangeInput
      min={minArea}
      max={maxArea}
      config={{
        minLabel: t("min_label"),
        maxLabel: t("max_label"),
        minPlaceholder: t("min_placeholder"),
        maxPlaceholder: t("max_placeholder"),
        unit: t("unit"),
        inputType: "number",
      }}
      callbacks={{
        onMinChange: onMinAreaChange,
        onMaxChange: onMaxAreaChange,
        onRangeChange,
      }}
      presetRanges={PRESET_RANGES}
      formatValue={formatArea}
      parseValue={parseArea}
      className={className}
    />
  );
}
