import { useQuery } from "@tanstack/react-query";
import type { Role, RolesResponse } from "../types";

export const ROLES_QUERY_KEY = "admin-roles";

/** 5 minutes in milliseconds */
const ROLES_STALE_TIME_MS = 1000 * 60 * 5;

async function fetchRoles(): Promise<Role[]> {
  const response = await fetch("/api/v1/admin/roles");

  if (!response.ok) {
    throw new Error("Failed to fetch roles");
  }

  const data: RolesResponse = await response.json();
  return data.roles;
}

export function useRoles() {
  return useQuery({
    queryKey: [ROLES_QUERY_KEY],
    queryFn: fetchRoles,
    staleTime: ROLES_STALE_TIME_MS,
  });
}
