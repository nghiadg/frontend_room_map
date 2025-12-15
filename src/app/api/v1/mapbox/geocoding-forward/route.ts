import { MAPBOX_SEARCH_GEOCODE_API_URL } from "../constants";
import { MapboxGeocodingForwardResponse } from "../types";
import { checkRateLimit } from "@/lib/rate-limit";

export async function GET(request: Request) {
  // Rate limit: 100 requests per minute for read operations
  const rateLimitResponse = await checkRateLimit(request, "read");
  if (rateLimitResponse) return rateLimitResponse;

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  if (!query) {
    return new Response(
      JSON.stringify({ error: "Missing 'query' parameter." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const params = new URLSearchParams({
    access_token: process.env.MAPBOX_SECRET_ACCESS_TOKEN ?? "",
    q: query,
    limit: "5",
    country: "vn",
    language: "vi",
    proximity: "ip",
  });

  const response = await fetch(
    `${MAPBOX_SEARCH_GEOCODE_API_URL}/forward?${params.toString()}`,
    {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return new Response(JSON.stringify({ error: await response.text() }), {
      status: response.status,
    });
  }
  const data: MapboxGeocodingForwardResponse = await response.json();
  return new Response(JSON.stringify(data), { status: response.status });
}
