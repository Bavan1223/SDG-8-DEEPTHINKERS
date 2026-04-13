/* ============================================================
   AgriAgent – useFetch hook
   Generic data-fetching hook with loading/error state
   ============================================================ */

import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Generic fetch hook.
 * @param url   Full URL or path to fetch from
 * @param deps  Optional dependency array to re-trigger (beyond url)
 */
export function useFetch<T>(url: string, deps: unknown[] = []): FetchState<T> {
  const [data, setData]       = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const fetchIdRef            = useRef(0); // Avoid race conditions

  const fetchData = useCallback(async () => {
    if (!url) return;

    setLoading(true);
    setError(null);
    const fetchId = ++fetchIdRef.current;

    try {
      const res = await axios.get<T>(url);
      if (fetchId === fetchIdRef.current) {
        setData(res.data);
      }
    } catch (err: unknown) {
      if (fetchId === fetchIdRef.current) {
        const message = axios.isAxiosError(err)
          ? err.response?.data?.message ?? err.message
          : 'Unknown error';
        setError(message);
      }
    } finally {
      if (fetchId === fetchIdRef.current) {
        setLoading(false);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, ...deps]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
