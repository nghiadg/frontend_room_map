import { createClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase admin client with service role key.
 * This bypasses RLS (Row Level Security) and should ONLY be used
 * for server-side administrative operations like:
 * - Cron jobs
 * - Admin-only operations
 * - Background tasks
 *
 * ⚠️ SECURITY WARNING:
 * - NEVER expose this client to the browser
 * - NEVER use in client components
 * - Only use in API routes that are properly secured
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable");
  }

  if (!serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY environment variable. " +
        "Get it from Supabase Dashboard → Settings → API → service_role key"
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
