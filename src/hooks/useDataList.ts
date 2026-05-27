import { useState, useEffect, useRef, useCallback } from "react";
import { dataService } from "../services/dataService";
import { queryCache } from "../services/queryCache";

export function useDataList<T>(table: string, orderField: string = "created_at") {
  const cacheKey = "nyna_cache_" + table;
  const mountedRef = useRef(true);

  // Lay cache ngay lap tuc de hien thi
  const [data, setData] = useState<T[]>(() => queryCache.getAny<T[]>(cacheKey) ?? []);
  
  // Chi show loading neu khong co cache gi ca
  const [loading, setLoading] = useState<boolean>(() => {
    const cached = queryCache.getAny<T[]>(cacheKey);
    return !cached || (cached as any[]).length === 0;
  });

  const load = useCallback(async (forceRefresh = false) => {
    if (!mountedRef.current) return;

    // Cache con tuoi -> hien thi ngay, khong fetch
    if (!forceRefresh && queryCache.isFresh(cacheKey)) {
      const fresh = queryCache.get<T[]>(cacheKey)!;
      if (fresh && (fresh as any[]).length > 0) {
        setData(fresh);
        setLoading(false);
        return;
      }
    }

    // Co stale cache -> hien thi luon, fetch ngam
    const stale = queryCache.getAny<T[]>(cacheKey);
    if (stale && (stale as any[]).length > 0 && !forceRefresh) {
      setData(stale);
      setLoading(false);
    }

    // Fetch tu Supabase
    try {
      const res = await dataService.list<T>(table, orderField);
      if (!mountedRef.current) return;
      if (res && (res as any[]).length > 0) {
        setData(res);
      } else if (!stale || (stale as any[]).length === 0) {
        setData([]);
      }
      setLoading(false);
    } catch (err) {
      console.error("useDataList error [" + table + "]:", err);
      if (mountedRef.current) setLoading(false);
    }
  }, [table, orderField, cacheKey]);

  useEffect(() => {
    mountedRef.current = true;
    load();
    return () => { mountedRef.current = false; };
  }, [load]);

  const refetch = useCallback(() => {
    queryCache.delete(cacheKey);
    load(true);
  }, [cacheKey, load]);

  return { data, loading, refetch };
}
