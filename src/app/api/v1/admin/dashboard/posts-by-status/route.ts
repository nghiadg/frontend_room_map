import { verifyAdminAccess } from "@/lib/api/admin-auth";
import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";

type PostsByStatusRow = {
  status: string;
  count: number;
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
    const { data, error } = await supabase.rpc("get_dashboard_posts_by_status");

    if (error) {
      console.error("Error fetching posts by status:", error);
      return NextResponse.json(
        { error: "Unable to load chart data. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json(data as PostsByStatusRow[]);
  } catch (error) {
    console.error(
      "Unexpected error in GET /api/v1/admin/dashboard/posts-by-status:",
      error
    );
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
