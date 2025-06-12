import { useEffect, useState } from "react";

export function useDebounce(value, delay) {
  // State to store debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timeout to update debounced value after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function:
    // This is run if `value` changes (re-render) or if the component unmounts.
    // It clears the previous timeout, preventing the debounced value from being updated
    // if the original value changes too quickly.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Only re-call effect if value or delay changes

  return debouncedValue;
}
