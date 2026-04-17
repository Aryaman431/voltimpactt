import { createBrowserClient, createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// ── Browser client (client components & hooks) ────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase = createBrowserClient<any>(supabaseUrl, supabaseKey);

// ── Server client (server components, layouts, API routes) ────────────────────
// Uses service role key to bypass RLS for auth checks
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createServerSupabaseClient(): ReturnType<typeof createServerClient<any>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return createServerClient<any>(supabaseUrl, serviceKey, {
    cookies: {
      getAll() { return []; },
      setAll() {},
    },
  });
}
