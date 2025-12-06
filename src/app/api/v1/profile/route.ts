import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { UpdateUserProfileData } from "@/services/types/profile";
import camelcaseKeys from "camelcase-keys";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("profiles")
      .select(
        `id, full_name, gender, role_id, date_of_birth, phone_number, provinces(*), districts(*), wards(*), address, roles(name)`
      )
      .eq("user_id", user.id)
      .limit(1)
      .single();

    if (error) {
      throw error;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const camelCaseData = camelcaseKeys(data as any, { deep: true });
    // Extract role name from nested roles object and exclude it from result
    // Note: roles is an object (not array) due to single() + foreign key relation
    const { roles, ...profileWithoutRoles } = camelCaseData;
    const roleName =
      roles && typeof roles === "object" && "name" in roles
        ? roles.name
        : undefined;
    const userProfile = {
      ...profileWithoutRoles,
      roleName,
    };

    return NextResponse.json(userProfile);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload: UpdateUserProfileData = await request.json();

    // Update profile by user_id (auth user) instead of profile id
    // This ensures users can only update their own profile
    const { data, error } = await supabase
      .from("profiles")
      .update(payload)
      .eq("user_id", user.id) // Match by auth user ID, not profile ID
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
