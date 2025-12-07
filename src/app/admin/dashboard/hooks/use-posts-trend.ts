import { useQuery } from "@tanstack/react-query";
import type { PostsTrend } from "../types";
import { DASHBOARD_STALE_TIME_MS, TREND_DAYS_BACK } from "../types";

const POSTS_TREND_QUERY_KEY = "dashboard-posts-trend";

interface UsePostsTrendOptions {
  daysBack?: number;
}

async function fetchPostsTrend(daysBack: number): Promise<PostsTrend[]> {
  const response = await fetch(
    `/api/v1/admin/dashboard/posts-trend?daysBack=${daysBack}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch posts trend");
  }

  return response.json();
}

export function usePostsTrend(options: UsePostsTrendOptions = {}) {
  const { daysBack = TREND_DAYS_BACK } = options;

  return useQuery({
    queryKey: [POSTS_TREND_QUERY_KEY, daysBack],
    queryFn: () => fetchPostsTrend(daysBack),
    staleTime: DASHBOARD_STALE_TIME_MS,
  });
}
