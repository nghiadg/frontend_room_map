import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";

// Make this route static - generated at build time
export const dynamic = "force-static";
// Revalidate once per day (roles rarely change)
export const revalidate = 86400;

export async function GET(request: Request) {
  // Rate limit: 100 requests per minute for read operations
  const rateLimitResponse = await checkRateLimit(request, "read");
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("roles")
      .select("id, name")
      .in("name", ["renter", "lessor"]) // Only allow user-selectable roles
      .order("id", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching roles:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
