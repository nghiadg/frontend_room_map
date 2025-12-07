import { verifyAdminAccess } from "@/lib/api/admin-auth";
import { NextResponse } from "next/server";
import camelcaseKeys from "camelcase-keys";

type TopDistrictRow = {
  district_name: string;
  province_name: string;
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
    const limitCount = parseInt(searchParams.get("limit") || "5", 10);

    // Call RPC function
    const { data, error } = await supabase.rpc("get_dashboard_top_districts", {
      limit_count: limitCount,
    });

    if (error) {
      console.error("Error fetching top districts:", error);
      return NextResponse.json(
        { error: "Unable to load chart data. Please try again later." },
        { status: 500 }
      );
    }

    const result = (data as TopDistrictRow[]).map((row) =>
      camelcaseKeys(row, { deep: true })
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error(
      "Unexpected error in GET /api/v1/admin/dashboard/top-districts:",
      error
    );
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
