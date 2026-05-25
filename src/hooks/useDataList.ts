import { useState, useEffect } from "react";
import { dataService } from "../services/dataService";
import { queryCache } from "../services/queryCache";
import { FALLBACK_DATA } from "../data/fallbackData";

export function useDataList<T>(table: string, orderField: string = "created_at") {
  const cacheKey = `nyna_cache_${table}`;

  // 1. Hiển thị ngay lập tức: cache > fallback JSON > rong
  const [data, setData] = useState<T[]>(() => {
    const cached = queryCache.getAny<T[]>(cacheKey);
    if (cached && cached.length > 0) return cached;
    return (FALLBACK_DATA[table] ?? []) as T[];
  });

  // 2. Chỉ show spinner nếu KHÔNG có gì để hiển thị (không cache, không fallback)
  const [loading, setLoading] = useState<boolean>(() => {
    const cached = queryCache.getAny<T[]>(cacheKey);
    const hasCached = cached && cached.length > 0;
    const hasFallback = (FALLBACK_DATA[table] ?? []).length > 0;
    return !hasCached && !hasFallback;
  });

  useEffect(() => {
    let cancelled = false;

    // Cache còn tươi -> dùng luôn, không fetch
    if (queryCache.isFresh(cacheKey)) {
      const fresh = queryCache.get<T[]>(cacheKey)!;
      if (fresh.length > 0) {
        setData(fresh);
        setLoading(false);
        return;
      }
    }

    // Fetch Supabase ngầm (user đã thấy fallback/cache rồi)
    const promiseKey = `${cacheKey}_fetch`;
    queryCache.getOrCreatePromise<T[]>(
      promiseKey,
      () => dataService.list<T>(table, orderField)
    ).then(res => {
      if (cancelled) return;
      queryCache.set(cacheKey, res);
      setData(res);
      setLoading(false);
    }).catch(err => {
      console.error(`useDataList error [${table}]:`, err);
      if (!cancelled) setLoading(false);
    });

    return () => { cancelled = true; };
  }, [cacheKey, table, orderField]);

  return { data, loading };
}
