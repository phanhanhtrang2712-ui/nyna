import { getSupabase } from "../lib/supabase";
import { queryCache } from "./queryCache";
import { FALLBACK_DATA } from "../data/fallbackData";

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

// Cac field nhe cho list view - KHONG lay image base64
const LIST_SELECT: Record<string, string> = {
  products: "id,created_at,title,brand,price,original_price,category,features,specifications,variants,image,images",
  brands: "*",
  news: "id,created_at,title,date,excerpt,image",
  videos: "*",
  distributors: "*",
  pages: "*",
  jobs: "*",
  settings: "*",
};

export const dataService = {
  async list<T>(table: string, orderField: string = "created_at"): Promise<T[]> {
    try {
      const supabase = getSupabase();
      // Chi lay cac field can thiet, bo qua image base64
      const selectFields = LIST_SELECT[table] || "*";
      const { data, error } = await supabase
        .from(table)
        .select(selectFields)
        .order(orderField, { ascending: false });

      if (error) {
        if (error.message.includes("column \"created_at\" does not exist")) {
          const { data: retryData, error: retryError } = await supabase
            .from(table)
            .select(selectFields)
            .order("createdAt", { ascending: false });
          if (retryError) throw retryError;
          if ((!retryData || retryData.length === 0) && FALLBACK_DATA[table]) {
            return FALLBACK_DATA[table] as T[];
          }
          return (retryData || []) as T[];
        }
        throw error;
      }

      const listData = data || [];
      if (listData.length === 0 && FALLBACK_DATA[table]) {
        return FALLBACK_DATA[table] as T[];
      }

      // Luu cache
      queryCache.set(`nyna_cache_${table}`, listData);
      return listData as T[];
    } catch (error) {
      console.error(`Supabase List Error [${table}]: `, error);
      if (FALLBACK_DATA[table]) {
        return FALLBACK_DATA[table] as T[];
      }
      return [];
    }
  },

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
    queryCache.clearTable(table);
    return inserted?.[0]?.id || "";
  },

  async update<T>(table: string, id: string, data: Partial<T>): Promise<void> {
    const supabase = getSupabase();
    const { error } = await supabase
      .from(table)
      .update(data as any)
      .eq("id", id);

    if (error) {
      console.error(`Supabase Update Error [${table}/${id}]: `, error);
      throw error;
    }
    queryCache.clearTable(table);
    queryCache.delete(`nyna_cache_${table}_${id}`);
  },

  async delete(table: string, id: string): Promise<void> {
    try {
      const supabase = getSupabase();
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
      queryCache.clearTable(table);
      queryCache.delete(`nyna_cache_${table}_${id}`);
    } catch (error) {
      console.error(`Supabase Delete Error [${table}/${id}]: `, error);
    }
  },

  async get<T>(table: string, id: string): Promise<T> {
    const cacheKey = `nyna_cache_${table}_${id}`;

    // 1. Cache rieng le con tuoi
    const cachedItem = queryCache.get<T>(cacheKey);
    if (cachedItem) return cachedItem;

    // 2. Tim trong list cache - nhung lay day du field tu Supabase
    const fetchFunc = async () => {
      try {
        const supabase = getSupabase();
        // get() lay TAT CA fields ke ca image base64
        const { data, error } = await supabase
          .from(table)
          .select("*")
          .eq("id", id)
          .single();
        if (error) throw error;
        return data as T;
      } catch (err) {
        if (FALLBACK_DATA[table]) {
          const found = FALLBACK_DATA[table].find((item: any) => item.id === id);
          if (found) return found as T;
        }
        throw err;
      }
    };

    const data = await queryCache.getOrCreatePromise(cacheKey, fetchFunc);
    queryCache.set(cacheKey, data);
    return data;
  },

  async getSettings(): Promise<any> {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .limit(1)
        .single();
      if (error && error.code !== "PGRST116") throw error;
      return data;
    } catch (error) {
      console.error("Supabase Get Settings Error: ", error);
      return null;
    }
  },

  async updateSettings(data: any): Promise<void> {
    try {
      const supabase = getSupabase();
      const current = await this.getSettings();
      if (current) {
        const { error } = await supabase.from("settings").update(data).eq("id", current.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("settings").insert([data]);
        if (error) throw error;
      }
    } catch (error) {
      console.error("Supabase Update Settings Error: ", error);
    }
  },
};
