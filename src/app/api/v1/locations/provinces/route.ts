import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";

export async function GET(request: Request) {
  // Rate limit: 100 requests per minute for read operations
  const rateLimitResponse = await checkRateLimit(request, "read");
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("provinces")
      .select("code, name");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Transform to camelCase format
    const provinces = data.map((province) => ({
      code: province.code,
      name: province.name,
    }));

    return NextResponse.json(provinces);
  } catch (error) {
    console.error("Error fetching provinces:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
