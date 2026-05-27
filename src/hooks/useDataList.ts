import { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';
import { queryCache } from '../services/queryCache';
import { FALLBACK_DATA } from '../data/fallbackData';

export function useDataList<T>(table: string, orderField: string = 'created_at') {
  const cacheKey = `nyna_cache_${table}`;

  const [data, setData] = useState<T[]>(() => {
    // Get item from in-memory or fallback localStorage instantly (even if stale)
    const cached = queryCache.getAny<T[]>(cacheKey);
    if (cached && cached.length > 0) {
      return cached;
    }
    // If no cache exists, return our static fallback backup data immediately (0 second delay!)
    return (FALLBACK_DATA[table] || []) as T[];
  });
  
  // Only show a loading spinner if we don't even have stale/cached or fallback data to present
  const [loading, setLoading] = useState(() => {
    const freshData = queryCache.get<T[]>(cacheKey);
    const hasData = freshData && freshData.length > 0;
    return !hasData && data.length === 0;
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
