/// <reference types="vite/client" />
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
let supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;

/**
 * Synchronous fetch of configuration as an absolute fallback if missing in Vite compile-time env
 */
const fetchConfigSync = () => {
  if (client) return;
  try {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/config', false); // synchronous request
    xhr.send(null);
    if (xhr.status === 200) {
      const config = JSON.parse(xhr.responseText);
      if (config.supabaseUrl && config.supabaseAnonKey) {
        supabaseUrl = config.supabaseUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
        supabaseAnonKey = config.supabaseAnonKey;
        client = createClient(supabaseUrl, supabaseAnonKey);
        console.log('Successfully initialized Supabase with runtime config (Sync).');
      }
    }
  } catch (err) {
    console.warn('Failed to fetch runtime config synchronously:', err);
  }
};

/**
 * Asynchronous background pre-initializer for clean non-blocking loading
 */
export const initSupabaseConfigAtRuntime = async (): Promise<void> => {
  if (client) return;
  if (supabaseUrl && supabaseAnonKey) {
    client = createClient(supabaseUrl, supabaseAnonKey);
    return;
  }
  try {
    const res = await fetch('/api/config');
    if (res.ok) {
      const config = await res.json();
      if (config.supabaseUrl && config.supabaseAnonKey) {
        supabaseUrl = config.supabaseUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
        supabaseAnonKey = config.supabaseAnonKey;
        client = createClient(supabaseUrl, supabaseAnonKey);
        console.log('Successfully initialized Supabase with runtime config (Async).');
      }
    }
  } catch (err) {
    console.warn('Failed to fetch runtime config asynchronously:', err);
  }
};

export const getSupabase = (): SupabaseClient => {
  if (!client) {
    // If credentials are not loaded yet, try to load them synchronously
    if (!supabaseUrl || !supabaseAnonKey) {
      fetchConfigSync();
    }
    
    // Fallback if still empty, initialize standard client
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase credentials missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in settings.');
    }
    
    if (!client) {
      client = createClient(supabaseUrl, supabaseAnonKey);
    }
  }
  return client;
};

/**
 * Uploads a file to a Supabase Storage bucket and returns its public URL
 */
export const uploadFileToStorage = async (file: File, bucketName: string = 'nyna'): Promise<string> => {
  const supabase = getSupabase();
  
  const fileExt = file.name?.split('.').pop() || 'png';
  const fileName = `${Math.random().toString(36).substring(2, 12)}_${Date.now()}.${fileExt}`;
  
  try {
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });
      
    if (uploadError) {
      // If bucket does not exist, attempt to create it automatically
      const isBucketError = uploadError.message?.toLowerCase().includes('bucket') || 
                            uploadError.message?.toLowerCase().includes('not found') ||
                            (uploadError as any).status === 404;
      if (isBucketError) {
        try {
          await supabase.storage.createBucket(bucketName, {
            public: true,
            fileSizeLimit: 10 * 1024 * 1024 // 10MB
          });
          
          // Retry uploading the file
          const { error: retryError } = await supabase.storage
            .from(bucketName)
            .upload(fileName, file, {
              cacheControl: '3600',
              upsert: false
            });
            
          if (retryError) throw retryError;
        } catch (bucketError: any) {
          console.warn('Auto-create bucket failed, throwing original upload error:', bucketError);
          throw uploadError;
        }
      } else {
        throw uploadError;
      }
    }
    
    // Retrieve the public URL
    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);
      
    if (!data?.publicUrl) {
      throw new Error('Không thể lấy liên kết công khai (public URL) cho tệp đã tải lên.');
    }
    
    return data.publicUrl;
  } catch (error: any) {
    console.error('Supabase Storage Upload Error:', error);
    throw new Error(`Lỗi tải ảnh lên: ${error.message || error}`);
  }
};

