import { useQuery } from "@tanstack/react-query";
import HttpClient from "@/lib/http-client";
import { Post } from "../posts-columns";

const httpClient = new HttpClient();

type AdminPostsParams = {
  page: number;
  pageSize: number;
  search?: string;
  propertyType?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

type AdminPostsResponse = {
  posts: Post[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

async function fetchAdminPosts(
  params: AdminPostsParams
): Promise<AdminPostsResponse> {
  const queryParams: Record<string, string> = {
    page: params.page.toString(),
    pageSize: params.pageSize.toString(),
  };

  if (params.search) {
    queryParams.search = params.search;
  }
  if (params.propertyType) {
    queryParams.propertyType = params.propertyType;
  }
  if (params.status) {
    queryParams.status = params.status;
  }
  if (params.sortBy) {
    queryParams.sortBy = params.sortBy;
  }
  if (params.sortOrder) {
    queryParams.sortOrder = params.sortOrder;
  }

  return httpClient.get<AdminPostsResponse>("/api/v1/admin/posts", {
    params: queryParams,
  });
}

export function useAdminPosts(params: AdminPostsParams) {
  return useQuery({
    queryKey: ["admin-posts", params],
    queryFn: () => fetchAdminPosts(params),
    staleTime: 30000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}
