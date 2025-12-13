import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import {
  POST_STATUS,
  canBumpPost,
  calculateNewExpiresAt,
} from "@/constants/post-status";
import { checkRateLimit } from "@/lib/rate-limit";

/**
 * PATCH /api/v1/posts/[id]/toggle-visibility
 * Toggle post visibility between 'active' and 'hidden' (owner only)
 */
export async function PATCH(
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

    // Only allow toggle for active, hidden, or expired posts
    if (!canBumpPost(existPost.status)) {
      return NextResponse.json(
        { error: "Cannot toggle visibility for this post status" },
        { status: 400 }
      );
    }

    // Toggle status: active -> hidden, hidden/expired -> active
    const newStatus =
      existPost.status === POST_STATUS.ACTIVE
        ? POST_STATUS.HIDDEN
        : POST_STATUS.ACTIVE;

    const now = new Date().toISOString();

    // Prepare update data
    const updateData: {
      status: string;
      updated_by: number;
      updated_at: string;
      expires_at?: string;
    } = {
      status: newStatus,
      updated_by: userProfileId,
      updated_at: now,
    };

    // If activating from expired, extend expiration using centralized helper
    if (
      newStatus === POST_STATUS.ACTIVE &&
      existPost.status === POST_STATUS.EXPIRED
    ) {
      updateData.expires_at = calculateNewExpiresAt().toISOString();
    }

    // Update post status
    const { error: updateError } = await supabase
      .from("posts")
      .update(updateData)
      .eq("id", postId);

    if (updateError) {
      console.error("Update error:", updateError);
      return NextResponse.json(
        { error: "Failed to update post visibility" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Post visibility updated successfully",
        status: newStatus,
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
