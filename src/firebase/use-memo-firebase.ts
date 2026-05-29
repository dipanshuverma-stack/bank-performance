'use client';

import { useMemo, DependencyList } from 'react';

/**
 * useMemoFirebase is a specialized useMemo for Firebase references and queries.
 * It ensures that a new reference is only created when the dependencies change.
 * This is crucial to prevent infinite re-render loops when using Firebase hooks
 * like useCollection or useDoc, as inline references/queries change on every render.
 */
export function useMemoFirebase<T>(factory: () => T, deps: DependencyList): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(factory, deps);
}
