import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";

type LockRequestBody = {
  isLocked: boolean;
};

/**
 * PATCH /api/v1/admin/users/[id]/lock
 * Toggle user lock status (Admin only)
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Rate limit: 20 requests per minute for write operations
  const rateLimitResponse = await checkRateLimit(request, "write");
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const supabase = await createClient();
    const { id } = await params;
    const profileId = parseInt(id, 10);

    if (isNaN(profileId) || profileId <= 0) {
      return NextResponse.json(
        { error: "Invalid profile ID" },
        { status: 400 }
      );
    }

    // Authorization: Check if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Authorization: Check if current user is admin and get their profile ID
    const { data: adminProfile } = await supabase
      .from("profiles")
      .select("id, role_id, roles(name)")
      .eq("user_id", user.id)
      .single();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const roleName = (adminProfile?.roles as any)?.name;
    if (roleName !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Prevent admin from locking themselves
    if (adminProfile?.id === profileId) {
      return NextResponse.json(
        { error: "Cannot lock your own account" },
        { status: 400 }
      );
    }

    // Parse request body
    const body: LockRequestBody = await request.json();
    const { isLocked } = body;

    if (typeof isLocked !== "boolean") {
      return NextResponse.json(
        { error: "isLocked must be a boolean" },
        { status: 400 }
      );
    }

    // Check if target user exists and is not admin
    const { data: targetProfile } = await supabase
      .from("profiles")
      .select("id, roles(name)")
      .eq("id", profileId)
      .single();

    if (!targetProfile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const targetRoleName = (targetProfile?.roles as any)?.name;
    if (targetRoleName === "admin") {
      return NextResponse.json(
        { error: "Cannot lock admin users" },
        { status: 400 }
      );
    }

    // Update lock status
    const updateData = isLocked
      ? {
          is_locked: true,
          locked_at: new Date().toISOString(),
          locked_by: adminProfile!.id,
        }
      : {
          is_locked: false,
          locked_at: null,
          locked_by: null,
        };

    const { error: updateError } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", profileId);

    if (updateError) {
      console.error("Error updating lock status:", updateError);
      return NextResponse.json(
        { error: "Failed to update lock status" },
        { status: 500 }
      );
    }

    // Verify update actually succeeded (RLS may silently block updates)
    const { data: updatedProfile } = await supabase
      .from("profiles")
      .select("is_locked")
      .eq("id", profileId)
      .single();

    if (updatedProfile?.is_locked !== isLocked) {
      console.error("Lock status update was blocked, possibly by RLS policy");
      return NextResponse.json(
        { error: "Unable to update lock status. Check database permissions." },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      isLocked,
      message: isLocked
        ? "User locked successfully"
        : "User unlocked successfully",
    });
  } catch (error) {
    console.error(
      "Unexpected error in PATCH /api/v1/admin/users/[id]/lock:",
      error
    );
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
