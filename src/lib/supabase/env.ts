/**
 * Public Supabase env (empty until the owner connects). The NEXT_PUBLIC_* names
 * are required for client code (admin) since only those are inlined into the
 * browser bundle; the non-prefixed fallbacks cover server paths when a Vercel
 * integration named them without the prefix.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

/** True once a Supabase project is wired up; gates the live data + admin paths. */
export function hasSupabase(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}
