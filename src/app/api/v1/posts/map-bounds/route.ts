import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import camelcaseKeys from "camelcase-keys";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const neLat = searchParams.get("neLat");
    const neLng = searchParams.get("neLng");
    const swLat = searchParams.get("swLat");
    const swLng = searchParams.get("swLng");

    // Validate required parameters
    if (!neLat || !neLng || !swLat || !swLng) {
      return NextResponse.json(
        { error: "Missing required coordinates: neLat, neLng, swLat, swLng" },
        { status: 400 }
      );
    }

    const ne = {
      lat: parseFloat(neLat),
      lng: parseFloat(neLng),
    };

    const sw = {
      lat: parseFloat(swLat),
      lng: parseFloat(swLng),
    };

    // Validate coordinate values
    if (isNaN(ne.lat) || isNaN(ne.lng) || isNaN(sw.lat) || isNaN(sw.lng)) {
      return NextResponse.json(
        { error: "Invalid coordinate values" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    let query = supabase
      .from("posts")
      .select("id, lat, lng, price, title")
      .eq("is_rented", false)
      .eq("is_deleted", false)
      .gte("lat", sw.lat)
      .lte("lat", ne.lat);

    // Handle bounds that cross the antimeridian by wrapping the longitude check
    if (sw.lng <= ne.lng) {
      query = query.gte("lng", sw.lng).lte("lng", ne.lng);
    } else {
      query = query.or(`lng.gte.${sw.lng},lng.lte.${ne.lng}`);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Transform to camelCase format
    const posts = camelcaseKeys(data, { deep: true });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts by map bounds:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
