import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** 是否已設定 Supabase 連線資訊（未設定時系統會自動退回 base64 模式）。 */
export const supabaseEnabled = Boolean(url && serviceKey);

let cached: SupabaseClient | null = null;

/**
 * 取得伺服器端 Supabase client（使用 service_role key）。
 * service_role 會繞過 RLS，僅能在伺服器端（API route / Server Component）使用，
 * 絕對不要把這個 key 暴露到前端。
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (!url || !serviceKey) {
    throw new Error(
      'Supabase 環境變數未設定，請在 .env.local 填入 SUPABASE_URL 與 SUPABASE_SERVICE_ROLE_KEY'
    );
  }
  if (!cached) {
    cached = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cached;
}
