import { createClient } from "@/lib/supabase/server";
import { getPropertyTypes } from "@/services/base/property-types";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const propertyTypes = await getPropertyTypes(supabase);

    return NextResponse.json(propertyTypes, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
