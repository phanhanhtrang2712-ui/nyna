import { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';
import { queryCache } from '../services/queryCache';
import { FALLBACK_DATA } from '../data/fallbackData';

export function useDataList<T>(table: string, orderField: string = 'created_at') {
  const cacheKey = `nyna_cache_${table}`;

  // Get only fresh, valid cache first
  const freshCache = queryCache.get<T[]>(cacheKey);
  const hasFreshData = freshCache && freshCache.length > 0;

  // Initialize data: only use fresh data if available, otherwise start empty to show loading skeleton
  const [data, setData] = useState<T[]>(hasFreshData ? (freshCache as T[]) : []);
  
  // Set initial loading state based on whether we have fresh data
  const [loading, setLoading] = useState(!hasFreshData);

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      // Re-check if cache became fresh in other concurrent mounts
      const freshData = queryCache.get<T[]>(cacheKey);
      if (freshData && freshData.length > 0) {
        if (isMounted) {
          setData(freshData);
          setLoading(false);
        }
        return;
      }

      try {
        const fetchPromise = () => dataService.list<T>(table, orderField);
        const res = await queryCache.getOrCreatePromise(cacheKey + '_promise', fetchPromise);
        
        if (isMounted) {
          setData(res);
          queryCache.set(cacheKey, res);
          setLoading(false);
        }
      } catch (err) {
        console.error(`Error loading ${table} from network:`, err);
        if (isMounted) {
          // If network fails and we didn't have any cached data, fill with the offline fallback data
          setData((prev) => {
            if (prev && prev.length > 0) return prev;
            return (FALLBACK_DATA[table] || []) as T[];
          });
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
