'use client';

import { useMemo, useRef } from 'react';

/**
 * Custom hook to memoize Firebase references and queries.
 * Prevents infinite re-renders by only updating the reference when dependencies change.
 */
export function useMemoFirebase<T>(factory: () => T, deps: any[]): T {
  const ref = useRef<T>(null as any);
  const prevDeps = useRef<any[]>([]);

  const changed = !prevDeps.current || deps.some((dep, i) => dep !== prevDeps.current[i]);

  if (changed) {
    ref.current = factory();
    prevDeps.current = deps;
  }

  return ref.current;
}
