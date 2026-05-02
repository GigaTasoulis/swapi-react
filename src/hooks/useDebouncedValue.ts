import { useEffect, useState } from "react";

/**
 * Returns a debounced copy of `value` that updates only after `delay` ms
 * have passed without further changes. Useful for limiting expensive
 * effects (network requests, heavy computation) tied to fast-changing input.
 */
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [value, delay]);

  return debouncedValue;
}
