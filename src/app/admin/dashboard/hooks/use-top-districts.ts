import { useQuery } from "@tanstack/react-query";
import type { TopDistrict } from "../types";
import { DASHBOARD_STALE_TIME_MS, TOP_DISTRICTS_LIMIT } from "../types";

const TOP_DISTRICTS_QUERY_KEY = "dashboard-top-districts";

interface UseTopDistrictsOptions {
  limit?: number;
}

async function fetchTopDistricts(limit: number): Promise<TopDistrict[]> {
  const response = await fetch(
    `/api/v1/admin/dashboard/top-districts?limit=${limit}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch top districts");
  }

  return response.json();
}

export function useTopDistricts(options: UseTopDistrictsOptions = {}) {
  const { limit = TOP_DISTRICTS_LIMIT } = options;

  return useQuery({
    queryKey: [TOP_DISTRICTS_QUERY_KEY, limit],
    queryFn: () => fetchTopDistricts(limit),
    staleTime: DASHBOARD_STALE_TIME_MS,
  });
}
