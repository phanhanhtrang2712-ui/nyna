import { getSupabase } from '../lib/supabase';
import { queryCache } from './queryCache';

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
      queryCache.clearTable(table);
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
      queryCache.clearTable(table);
      queryCache.delete(`nyna_cache_${table}_${id}`);
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
        queryCache.clearTable(table);
        queryCache.delete(`nyna_cache_${table}_${id}`);
      } catch (e) {
        console.warn(e);
      }
    } catch (error) {
       console.error(`Supabase Delete Error [${table}/${id}]: `, error);
    }
  },

  async get<T>(table: string, id: string): Promise<T> {
    const cacheKey = `nyna_cache_${table}_${id}`;
    
    // 1. Try individual cache first (fresh)
    const cachedItem = queryCache.get<T>(cacheKey);
    if (cachedItem) {
      return cachedItem;
    }

    // 2. Try table list cache next (fresh)
    const listCacheKey = `nyna_cache_${table}`;
    const cachedList = queryCache.get<any[]>(listCacheKey);
    if (cachedList) {
      const found = cachedList.find(item => item.id === id);
      if (found) {
        return found as T;
      }
    }

    // Fallback: network fetch with deduplication
    const fetchFunc = async () => {
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
      return data as T;
    };

    const data = await queryCache.getOrCreatePromise(cacheKey, fetchFunc);
    
    // Save to individual cache
    queryCache.set(cacheKey, data);

    return data;
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
