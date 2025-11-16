import { useCallback, useEffect } from "react";

export function useClickOutside(
  ref: React.RefObject<HTMLElement>,
  callback: () => void
) {
  const handleClickOutside = useCallback(() => {
    if (
      ref.current &&
      !ref.current.contains((document.activeElement as Node) || null)
    ) {
      callback();
    }
  }, [ref, callback]);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);
}
