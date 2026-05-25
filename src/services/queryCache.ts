type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

class QueryCache {
  private cache = new Map<string, CacheEntry<any>>();
  private promises = new Map<string, Promise<any>>();
  private ttl = 5 * 60 * 1000;

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (entry) {
      if (Date.now() - entry.timestamp < this.ttl) {
        return entry.data as T;
      }
    }
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        const data = parsed.value;
        const ts = parsed.timestamp || 0;
        this.cache.set(key, { data, timestamp: ts });
        if (Date.now() - ts < this.ttl) {
          return data as T;
        }
      }
    } catch (e) {
      console.warn(`QueryCache read error [${key}]:`, e);
    }
    return null;
  }

  getAny<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (entry) return entry.data as T;
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        const data = parsed.value;
        this.cache.set(key, { data, timestamp: parsed.timestamp || 0 });
        return data as T;
      }
    } catch (e) {
      console.warn(`QueryCache getAny error [${key}]:`, e);
    }
    return null;
  }

  set<T>(key: string, value: T): void {
    const timestamp = Date.now();
    this.cache.set(key, { data: value, timestamp });
    try {
      localStorage.setItem(key, JSON.stringify({ value, timestamp }));
    } catch (e) {
      console.warn(`QueryCache write error [${key}]:`, e);
    }
  }

  delete(key: string): void {
    this.cache.delete(key);
    try { localStorage.removeItem(key); } catch { /* ignore */ }
  }

  clearTable(table: string): void {
    const prefix = `nyna_cache_${table}`;
    this.cache.forEach((_, key) => {
      if (key.startsWith(prefix)) this.cache.delete(key);
    });
    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) localStorage.removeItem(key);
      }
    } catch { /* ignore */ }
  }

  getOrCreatePromise<T>(key: string, fetchFn: () => Promise<T>): Promise<T> {
    const existing = this.promises.get(key);
    if (existing) return existing;
    const cacheKey = key.replace('_promise', '');
    const promise = fetchFn()
      .then(result => {
        this.set(cacheKey, result);
        return result;
      })
      .finally(() => {
        this.promises.delete(key);
      });
    this.promises.set(key, promise);
    return promise;
  }

  isFresh(key: string): boolean {
    return this.get(key) !== null;
  }
}

export const queryCache = new QueryCache();
