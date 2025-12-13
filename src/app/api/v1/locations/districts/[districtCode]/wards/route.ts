import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ districtCode: string }> }
) {
  // Rate limit: 100 requests per minute for read operations
  const rateLimitResponse = await checkRateLimit(request, "read");
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { districtCode } = await params;

    if (!districtCode) {
      return NextResponse.json(
        { error: "District code is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("wards")
      .select("code, name, district_code")
      .eq("district_code", districtCode);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Transform to camelCase format
    const wards = data.map((ward) => ({
      code: ward.code,
      name: ward.name,
      districtCode: ward.district_code,
    }));

    return NextResponse.json(wards);
  } catch (error) {
    console.error("Error fetching wards:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
