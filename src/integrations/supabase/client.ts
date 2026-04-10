import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY =
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) ||
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined);

export const hasSupabaseEnv = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabaseConfigError = hasSupabaseEnv
  ? null
  : "Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY (or VITE_SUPABASE_ANON_KEY).";

if (!hasSupabaseEnv) {
  console.error(supabaseConfigError);
}

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

const safeUrl = SUPABASE_URL || "https://placeholder.supabase.co";
const safeAnonKey = SUPABASE_ANON_KEY || "public-anon-key-placeholder";

export const supabase = createClient<Database>(safeUrl, safeAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});