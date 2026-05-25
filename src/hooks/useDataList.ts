import { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';
import { queryCache } from '../services/queryCache';

export function useDataList<T>(table: string, orderField: string = 'created_at') {
  const cacheKey = `nyna_cache_${table}`;

  const [data, setData] = useState<T[]>(() => {
    // Get item from in-memory or fallback localStorage instantly (even if stale)
    return queryCache.getAny<T[]>(cacheKey) || [];
  });
  
  // Only show a loading spinner if we don't even have stale/cached data to present
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
          const cachedData = queryCache.getAny<T[]>(cacheKey);
          const hasChanged = !cachedData || JSON.stringify(cachedData) !== JSON.stringify(res);

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
