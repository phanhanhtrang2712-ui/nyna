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
    if (entry && Date.now() - entry.timestamp < this.ttl) {
      return entry.data as T;
    }
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        const ts = parsed.timestamp || 0;
        this.cache.set(key, { data: parsed.value, timestamp: ts });
        if (Date.now() - ts < this.ttl) return parsed.value as T;
      }
    } catch { }
    return null;
  }

  getAny<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (entry) return entry.data as T;
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        this.cache.set(key, { data: parsed.value, timestamp: parsed.timestamp || 0 });
        return parsed.value as T;
      }
    } catch { }
    return null;
  }

  set<T>(key: string, value: T): void {
    const timestamp = Date.now();
    this.cache.set(key, { data: value, timestamp });
    try {
      localStorage.setItem(key, JSON.stringify({ value, timestamp }));
    } catch { }
  }

  delete(key: string): void {
    this.cache.delete(key);
    try { localStorage.removeItem(key); } catch { }
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
    } catch { }
  }

  getOrCreatePromise<T>(promiseKey: string, fetchFn: () => Promise<T>): Promise<T> {
    const existing = this.promises.get(promiseKey);
    if (existing) return existing;
    const promise = fetchFn().finally(() => {
      this.promises.delete(promiseKey);
    });
    this.promises.set(promiseKey, promise);
    return promise;
  }

  isFresh(key: string): boolean {
    return this.get(key) !== null;
  }
}

export const queryCache = new QueryCache();
