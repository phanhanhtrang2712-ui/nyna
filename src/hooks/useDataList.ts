import { useState, useEffect, useRef, useCallback } from "react";
import { dataService } from "../services/dataService";
import { queryCache } from "../services/queryCache";

export function useDataList<T>(table: string, orderField: string = "created_at") {
  const cacheKey = `nyna_cache_${table}`;
  const mountedRef = useRef(true);
  const fetchedRef = useRef(false);

  // Khoi tao tu cache neu co
  const [data, setData] = useState<T[]>(() => queryCache.getAny<T[]>(cacheKey) ?? []);
  const [loading, setLoading] = useState<boolean>(true);

  const load = useCallback(async (forceRefresh = false) => {
    if (!mountedRef.current) return;

    // Cache con tuoi va khong force refresh -> dung luon
    if (!forceRefresh && queryCache.isFresh(cacheKey)) {
      const fresh = queryCache.get<T[]>(cacheKey)!;
      if (fresh && fresh.length > 0) {
        setData(fresh);
        setLoading(false);
        fetchedRef.current = true;
        return;
      }
    }

    // Co stale cache -> hien thi truoc, fetch moi ngam
    const stale = queryCache.getAny<T[]>(cacheKey);
    if (stale && stale.length > 0 && !forceRefresh) {
      setData(stale);
      setLoading(false);
    }

    try {
      const res = await dataService.list<T>(table, orderField);
      if (!mountedRef.current) return;

      // Chi update neu co data that su
      if (res && res.length > 0) {
        setData(res);
        queryCache.set(cacheKey, res);
      } else if (!stale || stale.length === 0) {
        // Khong co cache va fetch ve rong -> van set loading false
        setData([]);
      }
      setLoading(false);
      fetchedRef.current = true;
    } catch (err) {
      console.error(`useDataList error [${table}]:`, err);
      if (mountedRef.current) setLoading(false);
    }
  }, [table, orderField, cacheKey]);

  useEffect(() => {
    mountedRef.current = true;
    fetchedRef.current = false;
    load();
    return () => { mountedRef.current = false; };
  }, [load]);

  // Expose refetch de force reload khi can
  const refetch = useCallback(() => {
    queryCache.delete(cacheKey);
    load(true);
  }, [cacheKey, load]);

  return { data, loading, refetch };
}
