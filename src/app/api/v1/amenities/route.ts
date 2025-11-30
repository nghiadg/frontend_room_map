import { createClient } from "@/lib/supabase/server";
import { getAmenities } from "@/services/base/amenities";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const amenities = await getAmenities(supabase);

    return NextResponse.json(amenities, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
