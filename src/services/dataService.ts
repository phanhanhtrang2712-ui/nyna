import { getSupabase } from '../lib/supabase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export const dataService = {
  // Generic list
  async list<T>(table: string, orderField: string = 'created_at'): Promise<T[]> {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .order(orderField, { ascending: false });
      
      if (error) {
        // Fallback for tables that might still use camelCase from Firestore migration
        if (error.message.includes('column "created_at" does not exist')) {
          const { data: retryData, error: retryError } = await supabase
            .from(table)
            .select('*')
            .order('createdAt', { ascending: false });
          if (retryError) throw retryError;
          return retryData as T[];
        }
        throw error;
      }
      return (data || []) as T[];
    } catch (error) {
      console.error(`Supabase List Error [${table}]: `, error);
      return [];
    }
  },

  // Generic create
  async create<T>(table: string, data: T): Promise<string> {
    const supabase = getSupabase();
    const { data: inserted, error } = await supabase
      .from(table)
      .insert([data] as any)
      .select();
    
    if (error) {
      console.error(`Supabase Create Error [${table}]: `, error);
      throw error;
    }
    // Evict client-side cache
    try {
      localStorage.removeItem(`nyna_cache_${table}`);
    } catch (e) {
      console.warn(e);
    }
    return inserted?.[0]?.id || '';
  },

  // Generic update
  async update<T>(table: string, id: string, data: Partial<T>): Promise<void> {
    const supabase = getSupabase();
    const { error } = await supabase
      .from(table)
      .update(data as any)
      .eq('id', id);
    
    if (error) {
      console.error(`Supabase Update Error [${table}/${id}]: `, error);
      throw error;
    }
    // Evict client-side cache
    try {
      localStorage.removeItem(`nyna_cache_${table}`);
      localStorage.removeItem(`nyna_cache_${table}_${id}`);
    } catch (e) {
      console.warn(e);
    }
  },

  // Generic delete
  async delete(table: string, id: string): Promise<void> {
    try {
      const supabase = getSupabase();
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      // Evict client-side cache
      try {
        localStorage.removeItem(`nyna_cache_${table}`);
        localStorage.removeItem(`nyna_cache_${table}_${id}`);
      } catch (e) {
        console.warn(e);
      }
    } catch (error) {
      console.error(`Supabase Delete Error [${table}/${id}]: `, error);
    }
  },

  async get<T>(table: string, id: string): Promise<T> {
    // 1. Try to fetch from general table list cache if fresh (5-minute TTL)
    try {
      const cached = localStorage.getItem(`nyna_cache_${table}`);
      if (cached) {
        const { value, timestamp } = JSON.parse(cached);
        const age = Date.now() - timestamp;
        const TTL = 5 * 60 * 1000; // 5 minutes TTL
        if (age < TTL) {
          const found = (value as any[]).find(item => item.id === id);
          if (found) {
            return found as T;
          }
        }
      }
    } catch (e) {
      console.warn(`Error reading general cache in get [${table}/${id}]:`, e);
    }

    // 2. Try to fetch from specific item cache if fresh (5-minute TTL)
    try {
      const cacheKey = `nyna_cache_${table}_${id}`;
      const cachedItem = localStorage.getItem(cacheKey);
      if (cachedItem) {
        const { value, timestamp } = JSON.parse(cachedItem);
        const age = Date.now() - timestamp;
        const TTL = 5 * 60 * 1000; // 5 minutes TTL
        if (age < TTL) {
          return value as T;
        }
      }
    } catch (e) {
      console.warn(`Error reading individual cache in get [${table}/${id}]:`, e);
    }

    // Fallback: network fetch
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Supabase Get Error [${table}/${id}]: `, error);
      throw error;
    }

    // Save fetched item to individual cache
    try {
      localStorage.setItem(`nyna_cache_${table}_${id}`, JSON.stringify({
        value: data,
        timestamp: Date.now()
      }));
    } catch (e) {
      console.warn(`Error saving individual cache for [${table}/${id}]:`, e);
    }

    return data as T;
  },

  // Settings
  async getSettings(): Promise<any> {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error; 
      return data;
    } catch (error) {
      console.error('Supabase Get Settings Error: ', error);
      return null;
    }
  },

  async updateSettings(data: any): Promise<void> {
    try {
      const supabase = getSupabase();
      const current = await this.getSettings();
      if (current) {
        const { error } = await supabase
          .from('settings')
          .update(data)
          .eq('id', current.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('settings')
          .insert([data]);
        if (error) throw error;
      }
    } catch (error) {
      console.error('Supabase Update Settings Error: ', error);
    }
  }
};
