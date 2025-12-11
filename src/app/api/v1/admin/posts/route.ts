import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import camelcaseKeys from "camelcase-keys";

type AdminPostRow = {
  id: number;
  title: string;
  address: string;
  ward_name: string | null;
  district_name: string | null;
  province_name: string | null;
  price: number;
  area: number;
  property_type_key: string;
  property_type_name: string;
  status: string;
  source: string;
  created_at: string;
  creator_id: number;
  creator_name: string;
  creator_email: string | null;
  first_image_url: string | null;
  image_count: number;
  total_count: number;
};

export async function GET(request: Request) {
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
    const propertyType = searchParams.get("propertyType") || "";
    const status = searchParams.get("status") || "";
    const sortBy = searchParams.get("sortBy") || "created_at";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    // Call RPC function
    const { data, error } = await supabase.rpc("get_admin_posts", {
      page_number: page,
      page_size: pageSize,
      search_query: search,
      property_type_filter: propertyType,
      status_filter: status,
      sort_by: sortBy,
      sort_order: sortOrder,
      date_from: dateFrom || null,
      date_to: dateTo || null,
    });

    if (error) {
      console.error("Error fetching admin posts:", error);
      return NextResponse.json(
        { error: "Unable to load posts. Please try again later." },
        { status: 500 }
      );
    }

    const rows = (data as AdminPostRow[]) || [];
    const totalCount = rows.length > 0 ? rows[0].total_count : 0;
    const totalPages = Math.ceil(totalCount / pageSize);

    // Transform to camelCase and remove total_count from each row
    const posts = rows.map((row) => {
      const { total_count: _totalCount, ...post } = row;
      return camelcaseKeys(post, { deep: true });
    });

    return NextResponse.json({
      posts,
      totalCount,
      page,
      pageSize,
      totalPages,
    });
  } catch (error) {
    console.error("Unexpected error in GET /api/v1/admin/posts:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
