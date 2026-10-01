import { useState, useEffect } from 'react';
import { DEBOUNCE_MS } from '@constants/student';

/**
 * Delays updating the returned value until the input hasn't
 * changed for DEBOUNCE_MS milliseconds (400 ms for MSSV 23694851).
 */
function useDebouncedValue<T>(value: T, ms: number = DEBOUNCE_MS): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(timer);
  }, [value, ms]);

  return debounced;
}

export default useDebouncedValue;
