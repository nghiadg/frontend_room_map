import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import camelcaseKeys from "camelcase-keys";
import { checkRateLimit } from "@/lib/rate-limit";

type AdminUserRow = {
  id: number;
  user_id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  phone_number: string | null;
  role: string;
  created_at: string;
  total_count: number;
};

export async function GET(request: Request) {
  // Rate limit: 100 requests per minute for read operations
  const rateLimitResponse = await checkRateLimit(request, "read");
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    // Authorization: Check if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Authorization: Check if user is admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role_id, roles(name)")
      .eq("user_id", user.id)
      .single();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const roleName = (profile?.roles as any)?.name;
    if (roleName !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Parse query parameters
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";
    const sortBy = searchParams.get("sortBy") || "created_at";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Call RPC function
    const { data, error } = await supabase.rpc("get_admin_users", {
      page_number: page,
      page_size: pageSize,
      search_query: search,
      role_filter: role,
      sort_by: sortBy,
      sort_order: sortOrder,
    });

    if (error) {
      console.error("Error fetching admin users:", error);
      return NextResponse.json(
        { error: "Unable to load users. Please try again later." },
        { status: 500 }
      );
    }

    const rows = (data as AdminUserRow[]) || [];
    const totalCount = rows.length > 0 ? rows[0].total_count : 0;
    const totalPages = Math.ceil(totalCount / pageSize);

    // Transform to camelCase and remove total_count from each row
    const users = rows.map((row) => {
      const { total_count: _totalCount, ...user } = row;
      return camelcaseKeys(user, { deep: true });
    });

    return NextResponse.json({
      users,
      totalCount,
      page,
      pageSize,
      totalPages,
    });
  } catch (error) {
    console.error("Unexpected error in GET /api/v1/admin/users:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
