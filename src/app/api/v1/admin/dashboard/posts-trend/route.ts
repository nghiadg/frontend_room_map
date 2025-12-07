import { verifyAdminAccess } from "@/lib/api/admin-auth";
import { NextResponse } from "next/server";

type PostsTrendRow = {
  date: string;
  count: number;
};

export async function GET(request: Request) {
  try {
    const authResult = await verifyAdminAccess();

    if (!authResult.isAuthorized) {
      return authResult.errorResponse;
    }

    const { supabase } = authResult;
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const daysBack = parseInt(searchParams.get("daysBack") || "30", 10);

    // Call RPC function
    const { data, error } = await supabase.rpc("get_dashboard_posts_trend", {
      days_back: daysBack,
    });

    if (error) {
      console.error("Error fetching posts trend:", error);
      return NextResponse.json(
        { error: "Unable to load chart data. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json(data as PostsTrendRow[]);
  } catch (error) {
    console.error(
      "Unexpected error in GET /api/v1/admin/dashboard/posts-trend:",
      error
    );
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
