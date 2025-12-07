/**
 * Shared types for range input components
 */

export type RangeValue = number | null;

export type PresetRange<T = number> = {
  label: string;
  min: T | null;
  max: T | null;
};

export type RangeInputConfig = {
  minLabel: string;
  maxLabel: string;
  minPlaceholder: string;
  maxPlaceholder: string;
  unit?: string;
  inputType?: "text" | "number";
};

export type RangeCallbacks = {
  onMinChange: (value: RangeValue) => void;
  onMaxChange: (value: RangeValue) => void;
  onRangeChange?: (min: RangeValue, max: RangeValue) => void;
};
