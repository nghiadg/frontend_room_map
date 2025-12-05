import { renderHook, act } from "@testing-library/react";
import { useBoolean } from "./use-boolean";

describe("useBoolean Hook", () => {
  it("should initialize with default value", () => {
    const { result } = renderHook(() => useBoolean(false));
    expect(result.current.value).toBe(false);
  });

  it("should initialize with custom value", () => {
    const { result } = renderHook(() => useBoolean(true));
    expect(result.current.value).toBe(true);
  });

  it("should toggle value", () => {
    const { result } = renderHook(() => useBoolean(false));

    act(() => {
      result.current.toggle(); // toggle
    });
    expect(result.current.value).toBe(true);

    act(() => {
      result.current.toggle(); // toggle again
    });
    expect(result.current.value).toBe(false);
  });

  it("should set value to true", () => {
    const { result } = renderHook(() => useBoolean(false));

    act(() => {
      result.current.setTrue(); // setTrue
    });
    expect(result.current.value).toBe(true);
  });

  it("should set value to false", () => {
    const { result } = renderHook(() => useBoolean(true));

    act(() => {
      result.current.setFalse(); // setFalse
    });
    expect(result.current.value).toBe(false);
  });

  it("should set value to specific boolean", () => {
    const { result } = renderHook(() => useBoolean(false));

    act(() => {
      result.current.setValue(true); // setValue
    });
    expect(result.current.value).toBe(true);

    act(() => {
      result.current.setValue(false); // setValue
    });
    expect(result.current.value).toBe(false);
  });
});
