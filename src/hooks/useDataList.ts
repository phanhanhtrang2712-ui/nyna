import { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';
import { FALLBACK_DATA } from '../data/fallbackData';

export function useDataList<T>(table: string, orderField: string = 'created_at') {
  // Always start with an empty list and loading state to fetch the true real database source
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await dataService.list<T>(table, orderField);
        
        if (isMounted) {
          setData(res);
          setLoading(false);
        }
      } catch (err) {
        console.error(`Error loading ${table} from network:`, err);
        if (isMounted) {
          // Fallback to offline dataset if network or configuration is failing
          setData((FALLBACK_DATA[table] || []) as T[]);
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
