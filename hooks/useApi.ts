'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<unknown>>();
const CACHE_TTL = 5 * 60 * 1000;

export function useApi<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = [],
  options?: { cacheKey?: string; ttl?: number; enabled?: boolean }
): UseApiState<T> & { refetch: () => Promise<void> } {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const execute = useCallback(async () => {
    const cacheKey = options?.cacheKey;
    const ttl = options?.ttl ?? CACHE_TTL;

    if (cacheKey) {
      const cached = cache.get(cacheKey) as CacheEntry<T> | undefined;
      if (cached && Date.now() - cached.timestamp < ttl) {
        setState({ data: cached.data, loading: false, error: null });
        return;
      }
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await fetcherRef.current();
      if (cacheKey) {
        cache.set(cacheKey, { data: result, timestamp: Date.now() });
      }
      setState({ data: result, loading: false, error: null });
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Error inesperado al obtener datos';
      setState({ data: null, loading: false, error: message });
    }
  }, deps);

  useEffect(() => {
    if (options?.enabled === false) {
      setState({ data: null, loading: false, error: null });
      return;
    }
    execute();
  }, [execute, options?.enabled]);

  return { ...state, refetch: execute };
}

export function invalidateCache(key: string) {
  cache.delete(key);
}

export function clearCache() {
  cache.clear();
}
