import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useTheme } from "./useTheme";

const STORAGE_KEY = "swapi-theme";

beforeEach(() => {
  localStorage.clear();
  // Reset the data-theme attribute between tests
  delete document.documentElement.dataset.theme;
});

afterEach(() => {
  delete document.documentElement.dataset.theme;
});

describe("useTheme", () => {
  describe("initialization", () => {
    it('defaults to "system" when nothing is stored', () => {
      const { result } = renderHook(() => useTheme());
      expect(result.current.theme).toBe("system");
    });

    it("reads the stored preference on init", () => {
      localStorage.setItem(STORAGE_KEY, "dark");
      const { result } = renderHook(() => useTheme());
      expect(result.current.theme).toBe("dark");
    });

    it('falls back to "system" for invalid stored values', () => {
      localStorage.setItem(STORAGE_KEY, "banana");
      const { result } = renderHook(() => useTheme());
      expect(result.current.theme).toBe("system");
    });
  });

  describe("DOM application", () => {
    it('sets data-theme attribute when theme is "dark"', () => {
      localStorage.setItem(STORAGE_KEY, "dark");
      renderHook(() => useTheme());
      expect(document.documentElement.dataset.theme).toBe("dark");
    });

    it('sets data-theme attribute when theme is "light"', () => {
      localStorage.setItem(STORAGE_KEY, "light");
      renderHook(() => useTheme());
      expect(document.documentElement.dataset.theme).toBe("light");
    });

    it('removes data-theme attribute for "system"', () => {
      // Set it first so we can prove it gets removed
      document.documentElement.dataset.theme = "dark";
      localStorage.setItem(STORAGE_KEY, "system");
      renderHook(() => useTheme());
      expect(document.documentElement.dataset.theme).toBeUndefined();
    });
  });

  describe("setTheme", () => {
    it("updates the returned theme value", () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme("dark");
      });

      expect(result.current.theme).toBe("dark");
    });

    it("persists the new value to localStorage", () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme("dark");
      });

      expect(localStorage.getItem(STORAGE_KEY)).toBe("dark");
    });

    it("applies the data-theme attribute on change", () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme("light");
      });

      expect(document.documentElement.dataset.theme).toBe("light");
    });

    it('removes the attribute when switching to "system"', () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme("dark");
      });

      act(() => {
        result.current.setTheme("system");
      });

      expect(document.documentElement.dataset.theme).toBeUndefined();
    });

    it("does not throw when localStorage is unavailable", () => {
      const spy = vi
        .spyOn(Storage.prototype, "setItem")
        .mockImplementation(() => {
          throw new Error("quota");
        });

      const { result } = renderHook(() => useTheme());
      expect(() => {
        act(() => {
          result.current.setTheme("dark");
        });
      }).not.toThrow();

      spy.mockRestore();
    });
  });
});
