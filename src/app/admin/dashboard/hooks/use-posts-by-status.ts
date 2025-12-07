import { useQuery } from "@tanstack/react-query";
import type { PostsByStatus } from "../types";
import { DASHBOARD_STALE_TIME_MS } from "../types";

const POSTS_BY_STATUS_QUERY_KEY = "dashboard-posts-by-status";

async function fetchPostsByStatus(): Promise<PostsByStatus[]> {
  const response = await fetch("/api/v1/admin/dashboard/posts-by-status");

  if (!response.ok) {
    throw new Error("Failed to fetch posts by status");
  }

  return response.json();
}

export function usePostsByStatus() {
  return useQuery({
    queryKey: [POSTS_BY_STATUS_QUERY_KEY],
    queryFn: fetchPostsByStatus,
    staleTime: DASHBOARD_STALE_TIME_MS,
  });
}
