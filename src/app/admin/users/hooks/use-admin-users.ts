import { useQuery } from "@tanstack/react-query";
import HttpClient from "@/lib/http-client";
import { User } from "../users-columns";

const httpClient = new HttpClient();

type AdminUsersParams = {
  page: number;
  pageSize: number;
  search?: string;
  role?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

type AdminUsersResponse = {
  users: User[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

async function fetchAdminUsers(
  params: AdminUsersParams
): Promise<AdminUsersResponse> {
  const queryParams: Record<string, string> = {
    page: params.page.toString(),
    pageSize: params.pageSize.toString(),
  };

  if (params.search) {
    queryParams.search = params.search;
  }
  if (params.role) {
    queryParams.role = params.role;
  }
  if (params.sortBy) {
    queryParams.sortBy = params.sortBy;
  }
  if (params.sortOrder) {
    queryParams.sortOrder = params.sortOrder;
  }

  return httpClient.get<AdminUsersResponse>("/api/v1/admin/users", {
    params: queryParams,
  });
}

export function useAdminUsers(params: AdminUsersParams) {
  return useQuery({
    queryKey: ["admin-users", params],
    queryFn: () => fetchAdminUsers(params),
    staleTime: 30000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}
