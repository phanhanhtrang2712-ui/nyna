import { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';
import { queryCache } from '../services/queryCache';
import { FALLBACK_DATA } from '../data/fallbackData';

export function useDataList<T>(table: string, orderField: string = 'created_at') {
  const cacheKey = `nyna_cache_${table}`;

  // Pre-calculate initial data to completely prevent Temporal Dead Zone (TDZ) ReferenceError
  const initialData = (() => {
    const cached = queryCache.getAny<T[]>(cacheKey);
    if (cached && cached.length > 0) {
      return cached;
    }
    // If no cache exists, return our static fallback backup data immediately (0 second delay!)
    return (FALLBACK_DATA[table] || []) as T[];
  })();

  const [data, setData] = useState<T[]>(initialData);
  
  // Only show a loading spinner if we don't even have stale/cached or fallback data to present
  const [loading, setLoading] = useState(() => {
    const freshData = queryCache.get<T[]>(cacheKey);
    const hasData = freshData && freshData.length > 0;
    return !hasData && initialData.length === 0;
  });

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      // Check if cache is fresh and within TTL (5 minutes)
      const freshData = queryCache.get<T[]>(cacheKey);
      if (freshData && freshData.length > 0) {
        if (isMounted) {
          setData(freshData);
          setLoading(false);
        }
        return; // Cache is totally fresh, no need to touch network
      }

      // If missing or stale, fetch from network with request coalescing/deduplication
      try {
        const fetchPromise = () => dataService.list<T>(table, orderField);
        const res = await queryCache.getOrCreatePromise(cacheKey + '_promise', fetchPromise);
        
        if (isMounted) {
          const currentReference = queryCache.getAny<T[]>(cacheKey) || (FALLBACK_DATA[table] || []);
          const hasChanged = JSON.stringify(currentReference) !== JSON.stringify(res);

          if (hasChanged) {
            setData(res);
            queryCache.set(cacheKey, res);
          }
          setLoading(false);
        }
      } catch (err) {
        console.error(`Error loading ${table} in background:`, err);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [table, orderField, cacheKey]);

  return { data, loading };
}
