type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

class QueryCache {
  private cache = new Map<string, CacheEntry<any>>();
  private promises = new Map<string, Promise<any>>();
  private ttl = 5 * 60 * 1000; // 5 minutes default TTL

  get<T>(key: string): T | null {
    // Caching is suspended as requested. Always return null to force real database query.
    return null;
  }

  // Returns the cache regardless of expiration (for Stale-While-Revalidate)
  getAny<T>(key: string): T | null {
    // Caching is suspended as requested. Always return null to force real database query.
    return null;
  }

  set<T>(key: string, value: T): void {
    // Caching is suspended. Do not store in memory or localStorage.
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
