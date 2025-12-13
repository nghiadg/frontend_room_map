import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import {
  POST_STATUS,
  canBumpPost,
  calculateNewExpiresAt,
} from "@/constants/post-status";

/**
 * POST /api/v1/admin/posts/[id]/bump
 * Admin-only endpoint to renew a post for another 14 days
 * Used when admin needs to help user extend their post
 */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;
    const postId = parseInt(id, 10);

    if (isNaN(postId) || postId <= 0) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
    }

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
      .select("id, role_id, roles(name)")
      .eq("user_id", user.id)
      .single();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const roleName = (profile?.roles as any)?.name;
    if (roleName !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if post exists and get current status
    const { data: existPost, error: postError } = await supabase
      .from("posts")
      .select("id, status")
      .eq("id", postId)
      .single();

    if (postError || !existPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Only allow bump for active, hidden, or expired posts
    if (!canBumpPost(existPost.status)) {
      return NextResponse.json(
        { error: "Cannot bump a post with this status" },
        { status: 400 }
      );
    }

    // Calculate new expiration date
    const newExpiresAt = calculateNewExpiresAt();
    const now = new Date().toISOString();

    // Update post: set status to active and extend expires_at
    const { error: updateError } = await supabase
      .from("posts")
      .update({
        status: POST_STATUS.ACTIVE,
        expires_at: newExpiresAt.toISOString(),
        updated_by: profile?.id,
        updated_at: now,
      })
      .eq("id", postId);

    if (updateError) {
      console.error("Admin bump error:", updateError);
      return NextResponse.json(
        { error: "Failed to bump post" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Post bumped successfully",
        expiresAt: newExpiresAt.toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Unexpected error in POST /api/v1/admin/posts/[id]/bump:",
      error
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
