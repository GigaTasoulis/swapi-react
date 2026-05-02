import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useDebouncedValue } from "./useDebouncedValue";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useDebouncedValue", () => {
  it("returns the initial value immediately", () => {
    const { result } = renderHook(() => useDebouncedValue("hello", 400));
    expect(result.current).toBe("hello");
  });

  it("does not update before the delay has passed", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 400),
      { initialProps: { value: "a" } },
    );

    rerender({ value: "ab" });
    act(() => {
      vi.advanceTimersByTime(399);
    });

    expect(result.current).toBe("a");
  });

  it("updates to the new value after the delay", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 400),
      { initialProps: { value: "a" } },
    );

    rerender({ value: "ab" });
    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(result.current).toBe("ab");
  });

  it("only emits the final value when changed multiple times within the delay", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 400),
      { initialProps: { value: "a" } },
    );

    rerender({ value: "ab" });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    rerender({ value: "abc" });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    rerender({ value: "abcd" });
    act(() => {
      vi.advanceTimersByTime(400);
    });

    // Only the latest value should be emitted, not 'ab' or 'abc'
    expect(result.current).toBe("abcd");
  });

  it("works with non-string values", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 200),
      { initialProps: { value: 1 } },
    );

    rerender({ value: 2 });
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current).toBe(2);
  });

  it("clears the pending timer on unmount", () => {
    const clearSpy = vi.spyOn(globalThis, "clearTimeout");
    const { unmount } = renderHook(() => useDebouncedValue("x", 400));

    unmount();

    expect(clearSpy).toHaveBeenCalled();
    clearSpy.mockRestore();
  });
});
