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
      .from("amenities")
      .select("id, name, key, order_index");

    if (error) {
      throw error;
    }

    const amenities = data
      .sort((a, b) => a.order_index - b.order_index)
      .map((amenity) => ({
        id: amenity.id,
        name: amenity.name,
        key: amenity.key,
        orderIndex: amenity.order_index,
      }));

    return NextResponse.json(amenities, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
