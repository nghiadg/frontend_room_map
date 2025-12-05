import { useCallback, useState } from "react";

type UseBooleanReturn = {
  value: boolean;
  setValue: (value: boolean) => void;
  toggle: () => void;
  setTrue: () => void;
  setFalse: () => void;
};

export const useBoolean = (initialValue: boolean): UseBooleanReturn => {
  if (typeof initialValue !== "boolean") {
    throw new Error("initialValue must be a boolean");
  }
  const [value, setValue] = useState(initialValue);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  return {
    value,
    setValue,
    toggle,
    setTrue,
    setFalse,
  };
};
