import { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';
import { queryCache } from '../services/queryCache';

export function useDataList<T>(table: string, orderField: string = 'created_at') {
  const cacheKey = `nyna_cache_${table}`;

  const [data, setData] = useState<T[]>(() => queryCache.getAny<T[]>(cacheKey) ?? []);
  const [loading, setLoading] = useState<boolean>(!queryCache.getAny<T[]>(cacheKey));

  useEffect(() => {
    let cancelled = false;

    if (queryCache.isFresh(cacheKey)) {
      const fresh = queryCache.get<T[]>(cacheKey)!;
      setData(fresh);
      setLoading(false);
      return;
    }

    const promiseKey = `${cacheKey}_promise`;
    queryCache.getOrCreatePromise<T[]>(promiseKey, () =>
      dataService.list<T>(table, orderField)
    ).then(res => {
      if (cancelled) return;
      setData(res);
      setLoading(false);
    }).catch(err => {
      console.error(`useDataList fetch error [${table}]:`, err);
      if (!cancelled) setLoading(false);
    });

    return () => { cancelled = true; };
  }, [cacheKey, table, orderField]);

  return { data, loading };
}
