import { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';
import { queryCache } from '../services/queryCache';
import { getSupabase } from '../lib/supabase';

const hasSupabaseToken = () => {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('sb-') && key.endsWith('-auth-token')) {
        return true;
      }
    }
  } catch (e) {
    // ignore
  }
  return false;
};

export function useDataList<T>(table: string, orderField: string = 'created_at') {
  const cacheKey = `nyna_cache_${table}`;

  const [data, setData] = useState<T[]>(() => {
    // Get item from in-memory or fallback localStorage instantly (even if stale)
    return queryCache.getAny<T[]>(cacheKey) || [];
  });
  
  // Only show a loading spinner if we don't even have stale/cached data to present
  const [loading, setLoading] = useState(() => {
    const freshData = queryCache.get<T[]>(cacheKey);
    return !freshData && data.length === 0;
  });

  const [error, setError] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      // Check if cache is fresh and within TTL (5 minutes)
      const freshData = queryCache.get<T[]>(cacheKey);
      if (freshData) {
        if (isMounted) {
          setData(freshData);
          setLoading(false);
          setError(null);
        }
        return; // Cache is totally fresh, no need to touch network
      }

      // If missing or stale, fetch from network with request coalescing/deduplication
      try {
        const fetchPromise = () => dataService.list<T>(table, orderField);
        const res = await queryCache.getOrCreatePromise(cacheKey + '_promise', fetchPromise);
        
        if (isMounted) {
          let skipWrite = false;
          setData(prev => {
            // Guard: If query returned empty, but we already have cached data,
            // and we have an auth session to restore, do NOT overwrite the state yet.
            if (res.length === 0 && prev.length > 0 && hasSupabaseToken()) {
              skipWrite = true;
              return prev;
            }
            if (JSON.stringify(prev) === JSON.stringify(res)) {
              return prev;
            }
            return res;
          });
          
          if (!skipWrite) {
            queryCache.set(cacheKey, res);
          }
          setLoading(false);
          setError(null);
        }
      } catch (err: any) {
        console.error(`Error loading ${table} in background:`, err);
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      }
    };

    fetchData();

    // Listen for auth state changes to re-fetch when session is restored/changed
    let subscription: any = null;
    try {
      const supabase = getSupabase();
      const { data: { subscription: sub } } = supabase.auth.onAuthStateChange((event, session) => {
        if (isMounted && (event === 'SIGNED_IN' || event === 'SIGNED_OUT')) {
          // Clear query caching promise and force a re-fetch since auth state has changed
          queryCache.delete(cacheKey + '_promise');
          fetchData();
        }
      });
      subscription = sub;
    } catch (e) {
      console.warn("Supabase auth listener error in useDataList:", e);
    }

    return () => {
      isMounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [table, orderField, cacheKey]);

  return { data, loading, error };
}

