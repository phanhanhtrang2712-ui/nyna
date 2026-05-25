import { useState, useEffect, useRef } from "react";
import { dataService } from "../services/dataService";
import { queryCache } from "../services/queryCache";

export function useDataList<T>(table: string, orderField: string = "created_at") {
  const cacheKey = `nyna_cache_${table}`;
  const mountedRef = useRef(true);

  const [data, setData] = useState<T[]>(() => {
    return queryCache.getAny<T[]>(cacheKey) ?? [];
  });

  const [loading, setLoading] = useState<boolean>(() => {
    const cached = queryCache.getAny<T[]>(cacheKey);
    return !cached || cached.length === 0;
  });

  useEffect(() => {
    mountedRef.current = true;

    const load = async () => {
      // Cache con tuoi -> dung luon
      if (queryCache.isFresh(cacheKey)) {
        const fresh = queryCache.get<T[]>(cacheKey)!;
        if (mountedRef.current) {
          setData(fresh);
          setLoading(false);
        }
        return;
      }

      // Fetch Supabase
      try {
        const res = await dataService.list<T>(table, orderField);
        if (mountedRef.current) {
          setData(res);
          setLoading(false);
          queryCache.set(cacheKey, res);
        }
      } catch (err) {
        console.error(`useDataList error [${table}]:`, err);
        if (mountedRef.current) setLoading(false);
      }
    };

    load();

    return () => {
      mountedRef.current = false;
    };
  }, [table, orderField, cacheKey]);

  return { data, loading };
}
