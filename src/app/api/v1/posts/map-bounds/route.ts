import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Limit to prevent overwhelming the map with too many markers
const POSTS_LIMIT = 500;

// Type for RPC function response
type PostMapData = {
  id: number;
  lat: number;
  lng: number;
  price: number;
  title: string;
  area: number;
  property_type_id: number;
};

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

    // Parse filter parameters
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const minArea = searchParams.get("minArea");
    const maxArea = searchParams.get("maxArea");
    const propertyTypeIds = searchParams.getAll("propertyTypeIds");
    const amenityIds = searchParams.getAll("amenityIds");

    const supabase = await createClient();

    // Parse array parameters
    const parsedAmenityIds =
      amenityIds.length > 0
        ? amenityIds.map((id) => parseInt(id)).filter((id) => !isNaN(id))
        : null;

    const parsedPropertyTypeIds =
      propertyTypeIds.length > 0
        ? propertyTypeIds.map((id) => parseInt(id)).filter((id) => !isNaN(id))
        : null;

    // Use RPC function for ALL queries - handles all filtering at database level
    const { data, error } = await supabase.rpc("get_posts_by_map_bounds", {
      ne_lat: ne.lat,
      ne_lng: ne.lng,
      sw_lat: sw.lat,
      sw_lng: sw.lng,
      min_price: minPrice ? parseFloat(minPrice) : null,
      max_price: maxPrice ? parseFloat(maxPrice) : null,
      min_area: minArea ? parseFloat(minArea) : null,
      max_area: maxArea ? parseFloat(maxArea) : null,
      property_type_ids: parsedPropertyTypeIds,
      amenity_ids: parsedAmenityIds,
      posts_limit: POSTS_LIMIT,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Transform and return only necessary fields for map markers
    const posts = data.map((post: PostMapData) => ({
      id: post.id,
      lat: post.lat,
      lng: post.lng,
      price: post.price,
      title: post.title,
    }));

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts by map bounds:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
