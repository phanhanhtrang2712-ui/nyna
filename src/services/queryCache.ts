type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

class QueryCache {
  private cache = new Map<string, CacheEntry<any>>();
  private promises = new Map<string, Promise<any>>();
  private ttl = 5 * 60 * 1000; // 5 minutes default TTL

  get<T>(key: string): T | null {
    // 1. Try to read from in-memory cache
    const entry = this.cache.get(key);
    if (entry) {
      const age = Date.now() - entry.timestamp;
      if (age < this.ttl) {
        return entry.data as T;
      }
    }

    // 2. Try to read from localStorage if memory is missing
    try {
      const cached = localStorage.getItem(key);
      if (cached) {
        const parsed = JSON.parse(cached);
        // Warm up in-memory cache
        this.cache.set(key, { data: parsed.value, timestamp: parsed.timestamp || Date.now() });
        
        const age = Date.now() - (parsed.timestamp || 0);
        if (age < this.ttl) {
          return parsed.value as T;
        }
      }
    } catch (e) {
      console.warn(`QueryCache read error for key ${key}:`, e);
    }

    return null;
  }

  // Returns the cache regardless of expiration (for Stale-While-Revalidate)
  getAny<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (entry) return entry.data as T;

    try {
      const cached = localStorage.getItem(key);
      if (cached) {
        const parsed = JSON.parse(cached);
        this.cache.set(key, { data: parsed.value, timestamp: parsed.timestamp || Date.now() });
        return parsed.value as T;
      }
    } catch (e) {
      console.warn(`QueryCache read error for key ${key}:`, e);
    }

    return null;
  }

  set<T>(key: string, value: T): void {
    const timestamp = Date.now();
    this.cache.set(key, { data: value, timestamp });
    try {
      localStorage.setItem(key, JSON.stringify({ value, timestamp }));
    } catch (e) {
      console.warn(`QueryCache write error for key ${key}:`, e);
    }
  }

  delete(key: string): void {
    this.cache.delete(key);
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn(`QueryCache delete error for key ${key}:`, e);
    }
  }

  clearTable(table: string): void {
    const tablePrefix = `nyna_cache_${table}`;
    this.cache.forEach((_, key) => {
      if (key.startsWith(tablePrefix) || key.startsWith(`nyna_cache_${table}_`)) {
        this.cache.delete(key);
      }
    });

    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && (key.startsWith(tablePrefix) || key.startsWith(`nyna_cache_${table}_`))) {
          localStorage.removeItem(key);
        }
      }
    } catch (e) {
      console.warn(`QueryCache clearTable error for ${table}:`, e);
    }
  }

  // Deduplication: Coalesces parallel identical requests to a single promise
  getOrCreatePromise<T>(key: string, fetchFn: () => Promise<T>): Promise<T> {
    const existing = this.promises.get(key);
    if (existing) {
      return existing;
    }

    const promise = fetchFn().finally(() => {
      this.promises.delete(key);
    });

    this.promises.set(key, promise);
    return promise;
  }
}

export const queryCache = new QueryCache();
