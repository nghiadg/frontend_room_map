import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ provinceCode: string }> }
) {
  try {
    const { provinceCode } = await params;

    if (!provinceCode) {
      return NextResponse.json(
        { error: "Province code is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("districts")
      .select("code, name, province_code")
      .eq("province_code", provinceCode);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Transform to camelCase format
    const districts = data.map((district) => ({
      code: district.code,
      name: district.name,
      provinceCode: district.province_code,
    }));

    return NextResponse.json(districts);
  } catch (error) {
    console.error("Error fetching districts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
