import { useQuery } from "@tanstack/react-query";
import type { PostsByPropertyType } from "../types";
import { DASHBOARD_STALE_TIME_MS } from "../types";

const POSTS_BY_PROPERTY_TYPE_QUERY_KEY = "dashboard-posts-by-property-type";

async function fetchPostsByPropertyType(): Promise<PostsByPropertyType[]> {
  const response = await fetch(
    "/api/v1/admin/dashboard/posts-by-property-type"
  );

  if (!response.ok) {
    throw new Error("Failed to fetch posts by property type");
  }

  return response.json();
}

export function usePostsByPropertyType() {
  return useQuery({
    queryKey: [POSTS_BY_PROPERTY_TYPE_QUERY_KEY],
    queryFn: fetchPostsByPropertyType,
    staleTime: DASHBOARD_STALE_TIME_MS,
  });
}
