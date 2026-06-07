"use client";

import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_ANON_KEY, hasSupabase } from "./env";

/**
 * Browser client for client components (order insert from checkout, admin auth).
 * Returns null when Supabase isn't connected.
 */
export function getBrowserClient() {
  if (!hasSupabase()) return null;
  return createBrowserClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);
}
