import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    // Check if post exists, belongs to user, and is not already rented
    const { data: existPost, error: postError } = await supabase
      .from("posts")
      .select("id, created_by, is_rented")
      .eq("id", id)
      .eq("is_deleted", false)
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

    // Check if already rented
    if (existPost.is_rented) {
      return NextResponse.json(
        { error: "Post is already marked as rented" },
        { status: 400 }
      );
    }

    // Update post status to rented
    const { error: updateError } = await supabase
      .from("posts")
      .update({
        is_rented: true,
        updated_by: userProfileId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", postId);

    if (updateError) {
      console.error("Update error:", updateError);
      return NextResponse.json(
        { error: "Failed to update post" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Post marked as rented successfully" },
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
