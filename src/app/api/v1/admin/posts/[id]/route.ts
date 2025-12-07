import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

type DeletePostBody = {
  reason: string;
};

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;
    const postId = parseInt(id, 10);

    if (isNaN(postId)) {
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

    // Parse request body
    const body: DeletePostBody = await request.json();

    if (!body.reason || body.reason.trim() === "") {
      return NextResponse.json(
        { error: "Reason is required" },
        { status: 400 }
      );
    }

    // Call RPC function to delete post
    const { error } = await supabase.rpc("admin_delete_post", {
      p_post_id: postId,
      p_reason: body.reason.trim(),
      p_admin_id: profile?.id,
    });

    if (error) {
      console.error("Error deleting post:", error);
      if (error.message.includes("not found")) {
        return NextResponse.json(
          { error: "Post not found or already deleted" },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: "Unable to delete post. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(
      "Unexpected error in DELETE /api/v1/admin/posts/[id]:",
      error
    );
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
