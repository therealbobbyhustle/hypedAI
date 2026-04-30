import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
export const missingSupabaseEnv = [
  !supabaseUrl && "VITE_SUPABASE_URL",
  !supabaseAnonKey && "VITE_SUPABASE_ANON_KEY",
].filter(Boolean);

export function getSupabaseSetupMessage() {
  return missingSupabaseEnv.length
    ? `Supabase is not configured in this build. Add ${missingSupabaseEnv.join(" and ")} in Vercel, then redeploy.`
    : "";
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
