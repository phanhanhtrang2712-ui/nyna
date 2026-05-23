import { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';

export function useDataList<T>(table: string, orderField: string = 'created_at') {
  const [data, setData] = useState<T[]>(() => {
    // Synchronously check the local localStorage cache for instant UI rendering
    try {
      const cached = localStorage.getItem(`nyna_cache_${table}`);
      if (cached) {
        const { value } = JSON.parse(cached);
        return value as T[];
      }
    } catch (e) {
      console.warn(`Error parsing cache for ${table}:`, e);
    }
    return [];
  });
  const [loading, setLoading] = useState(data.length === 0);

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        const res = await dataService.list<T>(table, orderField);
        if (isMounted) {
          let hasChanged = true;
          try {
            const cached = localStorage.getItem(`nyna_cache_${table}`);
            if (cached) {
              const { value } = JSON.parse(cached);
              if (JSON.stringify(value) === JSON.stringify(res)) {
                hasChanged = false;
              }
            }
          } catch (e) {
            // cache is missing, empty or corrupt, so let's update
          }

          if (hasChanged) {
            setData(res);
            // Save the latest fetched data to local cache
            try {
              localStorage.setItem(`nyna_cache_${table}`, JSON.stringify({
                value: res,
                timestamp: Date.now()
              }));
            } catch (e) {
              console.warn(`Error saving cache for ${table}:`, e);
            }
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
  }, [table, orderField]);

  return { data, loading };
}
