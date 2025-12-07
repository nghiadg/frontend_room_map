import { verifyAdminAccess } from "@/lib/api/admin-auth";
import { NextResponse } from "next/server";
import camelcaseKeys from "camelcase-keys";

type PostsByPropertyTypeRow = {
  key: string;
  name: string;
  count: number;
};

export async function GET() {
  try {
    const authResult = await verifyAdminAccess();

    if (!authResult.isAuthorized) {
      return authResult.errorResponse;
    }

    const { supabase } = authResult;

    // Call RPC function
    const { data, error } = await supabase.rpc(
      "get_dashboard_posts_by_property_type"
    );

    if (error) {
      console.error("Error fetching posts by property type:", error);
      return NextResponse.json(
        { error: "Unable to load chart data. Please try again later." },
        { status: 500 }
      );
    }

    const result = (data as PostsByPropertyTypeRow[]).map((row) =>
      camelcaseKeys(row, { deep: true })
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error(
      "Unexpected error in GET /api/v1/admin/dashboard/posts-by-property-type:",
      error
    );
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
