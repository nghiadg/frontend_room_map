import { useQuery } from "@tanstack/react-query";
import type { DashboardOverview } from "../types";
import { DASHBOARD_STALE_TIME_MS } from "../types";

const DASHBOARD_OVERVIEW_QUERY_KEY = "dashboard-overview";

async function fetchDashboardOverview(): Promise<DashboardOverview> {
  const response = await fetch("/api/v1/admin/dashboard/overview");

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard overview");
  }

  return response.json();
}

export function useDashboardOverview() {
  return useQuery({
    queryKey: [DASHBOARD_OVERVIEW_QUERY_KEY],
    queryFn: fetchDashboardOverview,
    staleTime: DASHBOARD_STALE_TIME_MS,
  });
}
