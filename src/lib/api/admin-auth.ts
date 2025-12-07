import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";

type AdminAccessResult =
  | {
      isAuthorized: true;
      supabase: SupabaseClient;
    }
  | {
      isAuthorized: false;
      errorResponse: NextResponse;
      supabase: SupabaseClient;
    };

/**
 * Verifies that the current user is authenticated and has admin role.
 * @returns Object with isAuthorized flag, error response if not authorized, and supabase client
 */
export async function verifyAdminAccess(): Promise<AdminAccessResult> {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      isAuthorized: false,
      errorResponse: NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      ),
      supabase,
    };
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role_id, roles(name)")
    .eq("user_id", user.id)
    .single();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const roleName = (profile?.roles as any)?.name;

  if (roleName !== "admin") {
    return {
      isAuthorized: false,
      errorResponse: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
      supabase,
    };
  }

  return {
    isAuthorized: true,
    supabase,
  };
}
