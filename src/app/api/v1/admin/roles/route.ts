import { verifyAdminAccess } from "@/lib/api/admin-auth";
import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";

export async function GET(request: Request) {
  // Rate limit: 100 requests per minute for read operations
  const rateLimitResponse = await checkRateLimit(request, "read");
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const authResult = await verifyAdminAccess();

    if (!authResult.isAuthorized) {
      return authResult.errorResponse;
    }

    const { supabase } = authResult;

    // Get roles with user count (excluding soft-deleted roles)
    const { data, error } = await supabase
      .from("roles")
      .select(
        `
        id,
        name,
        created_at,
        updated_at,
        profiles!profiles_role_id_fkey(count)
      `
      )
      .is("deleted_at", null)
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching roles:", error);
      return NextResponse.json(
        { error: "Unable to load roles. Please try again later." },
        { status: 500 }
      );
    }

    // Transform data to include users_count
    const roles = data.map((role) => ({
      id: role.id,
      name: role.name,
      createdAt: role.created_at,
      updatedAt: role.updated_at,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      usersCount: (role.profiles as any)?.[0]?.count || 0,
    }));

    return NextResponse.json({ roles });
  } catch (error) {
    console.error("Unexpected error in GET /api/v1/admin/roles:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
