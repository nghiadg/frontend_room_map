import { verifyAdminAccess } from "@/lib/api/admin-auth";
import { NextResponse } from "next/server";
import camelcaseKeys from "camelcase-keys";
import { checkRateLimit } from "@/lib/rate-limit";

type DashboardOverviewRow = {
  total_posts: number;
  available_posts: number;
  rented_posts: number;
  deleted_posts: number;
  total_users: number;
  posts_last_30_days: number;
};

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

    // Call RPC function
    const { data, error } = await supabase.rpc("get_dashboard_overview");

    if (error) {
      console.error("Error fetching dashboard overview:", error);
      return NextResponse.json(
        { error: "Unable to load dashboard overview. Please try again later." },
        { status: 500 }
      );
    }

    const overview = camelcaseKeys(data as DashboardOverviewRow, {
      deep: true,
    });

    return NextResponse.json(overview);
  } catch (error) {
    console.error(
      "Unexpected error in GET /api/v1/admin/dashboard/overview:",
      error
    );
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
