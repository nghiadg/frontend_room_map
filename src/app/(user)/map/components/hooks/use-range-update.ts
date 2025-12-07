import { RangeValue, RangeCallbacks } from "../types";

/**
 * Custom hook to handle atomic range updates
 * Prevents React state batching issues by using onRangeChange when available
 */
export function useRangeUpdate(callbacks: RangeCallbacks) {
  const { onMinChange, onMaxChange, onRangeChange } = callbacks;

  const updateRange = (min: RangeValue, max: RangeValue) => {
    if (onRangeChange) {
      // Atomic update - both values updated together
      onRangeChange(min, max);
    } else {
      // Fallback to separate updates
      onMinChange(min);
      onMaxChange(max);
    }
  };

  return {
    updateMin: onMinChange,
    updateMax: onMaxChange,
    updateRange,
  };
}
