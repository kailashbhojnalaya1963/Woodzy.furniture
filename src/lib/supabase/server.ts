import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY, hasSupabase } from "./env";

/**
 * Lightweight read-only client for server components (public catalog).
 * No cookies/session needed — RLS allows anonymous SELECT on products/categories.
 * Returns null when Supabase isn't connected, so callers fall back to seed data.
 */
export function getReadClient(): SupabaseClient | null {
  if (!hasSupabase()) return null;
  return createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    auth: { persistSession: false },
  });
}
