/// <reference types="vite/client" />
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, "");
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient => {
  if (!client) {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase credentials missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in settings.');
    }
    client = createClient(supabaseUrl, supabaseAnonKey);
  }
  return client;
};
