import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  RangeValue,
  PresetRange,
  RangeInputConfig,
  RangeCallbacks,
} from "./types";
import { useRangeUpdate } from "./hooks/use-range-update";

type BaseRangeInputProps = {
  min: RangeValue;
  max: RangeValue;
  config: RangeInputConfig;
  callbacks: RangeCallbacks;
  presetRanges?: PresetRange[];
  formatValue: (value: RangeValue) => string;
  parseValue: (input: string) => RangeValue;
  className?: string;
};

/**
 * Generic base component for range inputs (price, area, etc.)
 * Eliminates code duplication by providing reusable range input UI
 */
export default function BaseRangeInput({
  min,
  max,
  config,
  callbacks,
  presetRanges = [],
  formatValue,
  parseValue,
  className,
}: BaseRangeInputProps) {
  const { updateMin, updateMax, updateRange } = useRangeUpdate(callbacks);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseValue(e.target.value);
    updateMin(value);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseValue(e.target.value);
    updateMax(value);
  };

  const handlePresetClick = (presetMin: RangeValue, presetMax: RangeValue) => {
    updateRange(presetMin, presetMax);
  };

  const isPresetActive = (preset: PresetRange) =>
    min === preset.min && max === preset.max;

  return (
    <div className={cn("space-y-3", className)}>
      {/* Min/Max Input Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Min Input */}
        <div className="space-y-1.5">
          <Label
            htmlFor={`${config.minLabel}-input`}
            className="text-xs text-muted-foreground"
          >
            {config.minLabel}
          </Label>
          <div className="relative">
            <Input
              id={`${config.minLabel}-input`}
              type={config.inputType || "text"}
              placeholder={config.minPlaceholder}
              value={formatValue(min)}
              onChange={handleMinChange}
              min={config.inputType === "number" ? "0" : undefined}
              step={config.inputType === "number" ? "0.1" : undefined}
              className={cn(
                "h-9",
                config.unit && "pr-10",
                config.inputType === "number" &&
                  "[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              )}
            />
            {config.unit && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                {config.unit}
              </span>
            )}
          </div>
        </div>

        {/* Max Input */}
        <div className="space-y-1.5">
          <Label
            htmlFor={`${config.maxLabel}-input`}
            className="text-xs text-muted-foreground"
          >
            {config.maxLabel}
          </Label>
          <div className="relative">
            <Input
              id={`${config.maxLabel}-input`}
              type={config.inputType || "text"}
              placeholder={config.maxPlaceholder}
              value={formatValue(max)}
              onChange={handleMaxChange}
              min={config.inputType === "number" ? "0" : undefined}
              step={config.inputType === "number" ? "0.1" : undefined}
              className={cn(
                "h-9",
                config.unit && "pr-10",
                config.inputType === "number" &&
                  "[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              )}
            />
            {config.unit && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                {config.unit}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Preset Range Buttons */}
      {presetRanges.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {presetRanges.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => handlePresetClick(preset.min, preset.max)}
              className={cn(
                "px-2.5 py-1 text-xs rounded-full border transition-all",
                "hover:bg-primary hover:text-primary-foreground hover:border-primary",
                isPresetActive(preset)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-foreground border-border"
              )}
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
