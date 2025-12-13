import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import {
  POST_STATUS,
  canBumpPost,
  calculateNewExpiresAt,
} from "@/constants/post-status";
import { checkRateLimit } from "@/lib/rate-limit";

/**
 * POST /api/v1/posts/[id]/bump
 * Renew a post for another 14 days (owner only)
 * Can only bump posts with status: active, hidden, or expired
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Rate limit: 20 requests per minute for write operations
  const rateLimitResponse = await checkRateLimit(request, "write");
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { id } = await params;

    // Validate post ID is a valid number
    const postId = parseInt(id, 10);
    if (isNaN(postId) || postId <= 0) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user profile
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", user.id)
      .limit(1)
      .single();

    if (profileError || !profileData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userProfileId = profileData.id;

    // Check if post exists and get current status
    const { data: existPost, error: postError } = await supabase
      .from("posts")
      .select("id, created_by, status")
      .eq("id", postId)
      .single();

    if (postError || !existPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check ownership
    if (existPost.created_by !== userProfileId) {
      return NextResponse.json(
        { error: "You are not authorized to modify this post" },
        { status: 403 }
      );
    }

    // Only allow bump for active, hidden, or expired posts
    if (!canBumpPost(existPost.status)) {
      return NextResponse.json(
        { error: "Cannot bump a post with this status" },
        { status: 400 }
      );
    }

    // Calculate new expiration date using centralized helper
    const newExpiresAt = calculateNewExpiresAt();
    const now = new Date().toISOString();

    // Update post: set status to active and extend expires_at
    const { error: updateError } = await supabase
      .from("posts")
      .update({
        status: POST_STATUS.ACTIVE,
        expires_at: newExpiresAt.toISOString(),
        updated_by: userProfileId,
        updated_at: now,
      })
      .eq("id", postId);

    if (updateError) {
      console.error("Bump error:", updateError);
      return NextResponse.json(
        { error: "Failed to bump post" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Post bumped successfully",
        expiresAt: newExpiresAt.toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
