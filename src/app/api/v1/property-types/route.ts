import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("property_types")
      .select("id, name, key, order_index, description");

    if (error) {
      throw error;
    }

    const propertyTypes = data
      .sort((a, b) => a.order_index - b.order_index)
      .map((propertyType) => ({
        id: propertyType.id,
        name: propertyType.name,
        key: propertyType.key,
        orderIndex: propertyType.order_index,
        description: propertyType.description,
      }));

    return NextResponse.json(propertyTypes, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
