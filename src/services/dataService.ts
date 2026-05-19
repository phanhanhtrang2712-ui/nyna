import { supabase } from '../lib/supabase';

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
    try {
      const { data: inserted, error } = await supabase
        .from(table)
        .insert([data] as any)
        .select();
      
      if (error) throw error;
      return inserted?.[0]?.id || '';
    } catch (error) {
      console.error(`Supabase Create Error [${table}]: `, error);
      return '';
    }
  },

  // Generic update
  async update<T>(table: string, id: string, data: Partial<T>): Promise<void> {
    try {
      const { error } = await supabase
        .from(table)
        .update(data as any)
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error(`Supabase Update Error [${table}/${id}]: `, error);
    }
  },

  // Generic delete
  async delete(table: string, id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error(`Supabase Delete Error [${table}/${id}]: `, error);
    }
  },

  // Settings
  async getSettings(): Promise<any> {
    try {
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
