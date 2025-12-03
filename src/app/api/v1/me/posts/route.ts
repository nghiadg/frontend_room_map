import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import camelcaseKeys from "camelcase-keys";
import { z } from "zod";

// Zod schema for request validation (SQL injection prevention)
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

export async function GET(request: Request) {
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

    // Get user profile to get integer profile ID
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", (await supabase.auth.getUser()).data.user?.id)
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

    // Build query - only select fields we actually need
    let query = supabase
      .from("posts")
      .select(
        `
        id,
        title,
        price,
        deposit,
        area,
        address,
        created_at,
        is_rented,
        post_images(url),
        property_types(id, name)
        `,
        { count: "exact" }
      )
      .eq("created_by", profile.id)
      .eq("is_deleted", false);

    // Apply search filter (sanitized by Zod)
    if (search && search.trim()) {
      query = query.or(`title.ilike.%${search}%,address.ilike.%${search}%`);
    }

    // Apply status filter (validated enum)
    // Note: is_published field doesn't exist yet in database
    // For now, we only filter by is_rented
    if (status && status !== "all") {
      if (status === "active") {
        query = query.eq("is_rented", false);
      } else if (status === "expired") {
        query = query.eq("is_rented", true);
      }
      // pending, hidden, draft - skip filter for now until is_published exists
    }

    // Apply date range filter (validated dates)
    if (dateFrom) {
      query = query.gte("created_at", dateFrom.toISOString());
    }
    if (dateTo) {
      query = query.lte("created_at", dateTo.toISOString());
    }

    // Apply sorting (validated enum)
    switch (sortBy) {
      case "newest":
        query = query.order("created_at", { ascending: false });
        break;
      case "oldest":
        query = query.order("created_at", { ascending: true });
        break;
      case "price_high":
        query = query.order("price", { ascending: false });
        break;
      case "price_low":
        query = query.order("price", { ascending: true });
        break;
      default:
        query = query.order("created_at", { ascending: false });
    }

    // Apply pagination (validated ranges)
    const offset = (page - 1) * pageSize;
    query = query.range(offset, offset + pageSize - 1);

    // Execute query
    const { data, error, count } = await query;

    if (error) {
      console.error("Database query error:", error);

      // Handle specific Supabase errors
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "No posts found matching your criteria." },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { error: "Unable to load posts. Please try again later." },
        { status: 500 }
      );
    }

    const totalPages = Math.ceil((count || 0) / pageSize);

    return NextResponse.json(
      {
        posts: camelcaseKeys(data || [], { deep: true }),
        totalCount: count || 0,
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
