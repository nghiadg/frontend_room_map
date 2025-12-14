import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit } from "@/lib/rate-limit";

// ============================================================================
// Types
// ============================================================================

/** Response type from get_user_posts RPC function */
type UserPostRpcResponse = {
  id: number;
  title: string;
  price: number;
  deposit: number;
  area: number;
  address: string;
  ward_name: string | null;
  district_name: string | null;
  province_name: string | null;
  created_at: string;
  expires_at: string | null;
  status: string;
  first_image_url: string | null;
  property_type_id: number | null;
  property_type_name: string | null;
  total_count: number;
};

// ============================================================================
// Validation Schema
// ============================================================================

/** Zod schema for request validation (SQL injection prevention) */
const PostsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(9),
  search: z
    .string()
    .max(100)
    .nullish()
    .transform((val) => val || undefined),
  status: z
    .enum(["all", "active", "pending", "hidden", "expired"])
    .nullish()
    .transform((val) => val || undefined),
  sortBy: z
    .enum(["newest", "oldest", "price_high", "price_low"])
    .default("newest"),
  dateFrom: z
    .string()
    .nullish()
    .transform((val) => (val ? new Date(val) : undefined)),
  dateTo: z
    .string()
    .nullish()
    .transform((val) => (val ? new Date(val) : undefined)),
});

// ============================================================================
// Helper Functions
// ============================================================================

/** Transform RPC response to API response format */
function transformPostResponse(post: UserPostRpcResponse) {
  return {
    id: post.id,
    title: post.title,
    price: post.price,
    deposit: post.deposit,
    area: post.area,
    address: post.address,
    wardName: post.ward_name,
    districtName: post.district_name,
    provinceName: post.province_name,
    createdAt: post.created_at,
    expiresAt: post.expires_at,
    status: post.status,
    postImages: post.first_image_url ? [{ url: post.first_image_url }] : [],
    propertyTypes: post.property_type_id
      ? { id: post.property_type_id, name: post.property_type_name }
      : null,
  };
}

// ============================================================================
// Route Handler
// ============================================================================

export async function GET(request: Request) {
  // Rate limit: 100 requests per minute for read operations
  const rateLimitResponse = await checkRateLimit(request, "read");
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    // Validate and sanitize input
    const validationResult = PostsQuerySchema.safeParse({
      page: searchParams.get("page"),
      pageSize: searchParams.get("pageSize"),
      search: searchParams.get("search"),
      status: searchParams.get("status"),
      sortBy: searchParams.get("sortBy"),
      dateFrom: searchParams.get("dateFrom"),
      dateTo: searchParams.get("dateTo"),
    });

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid parameters",
          details: validationResult.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    const { page, pageSize, search, status, sortBy, dateFrom, dateTo } =
      validationResult.data;

    // Get authenticated user (cache result to avoid double await)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    // Get user profile to get integer profile ID
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, is_locked")
      .eq("user_id", user.id)
      .single();

    if (profileError) {
      console.error("Profile fetch error:", profileError);
      return NextResponse.json(
        {
          error: "Unable to verify user profile. Please try logging in again.",
        },
        { status: 401 }
      );
    }

    if (!profile) {
      return NextResponse.json(
        { error: "User profile not found. Please complete your profile." },
        { status: 404 }
      );
    }

    // Check if user is locked
    if (profile.is_locked) {
      return NextResponse.json(
        {
          error: "Your account has been locked. Please contact support.",
          code: "USER_LOCKED",
        },
        { status: 403 }
      );
    }

    // Use RPC function for better performance and maintainability
    const { data, error } = await supabase.rpc("get_user_posts", {
      _profile_id: profile.id,
      _page_number: page,
      _page_size: pageSize,
      _search_query: search || "",
      _status_filter: status || "",
      _sort_by: sortBy,
      _date_from: dateFrom?.toISOString() || null,
      _date_to: dateTo?.toISOString() || null,
    });

    if (error) {
      console.error("Database query error:", error);

      return NextResponse.json(
        { error: "Unable to load posts. Please try again later." },
        { status: 500 }
      );
    }

    // Get total count from first row (all rows have same total_count)
    const rpcData = (data || []) as UserPostRpcResponse[];
    const totalCount = rpcData[0]?.total_count ?? 0;
    const totalPages = Math.ceil(totalCount / pageSize);

    // Transform data to match expected API response format
    const posts = rpcData.map(transformPostResponse);

    return NextResponse.json(
      {
        posts,
        totalCount,
        page,
        pageSize,
        totalPages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error in GET /api/v1/me/posts:", error);

    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
