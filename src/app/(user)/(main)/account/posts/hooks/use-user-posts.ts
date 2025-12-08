import { Post } from "@/types/post";
import { useQuery } from "@tanstack/react-query";
import { PostFilters } from "./use-post-filters";
import { httpClient } from "@/lib/http-client";
import { QUERY_KEYS } from "@/constants/query-keys";

type PostsResponse = {
  posts: Post[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

type UseUserPostsParams = {
  filters: PostFilters;
  currentPage: number;
  pageSize: number;
};

async function fetchUserPosts({
  filters,
  currentPage,
  pageSize,
}: UseUserPostsParams): Promise<PostsResponse> {
  const params: Record<string, string> = {
    page: currentPage.toString(),
    pageSize: pageSize.toString(),
  };

  if (filters.search) {
    params.search = filters.search;
  }
  if (filters.status && filters.status !== "all") {
    params.status = filters.status;
  }
  if (filters.sortBy) {
    params.sortBy = filters.sortBy;
  }
  if (filters.dateRange?.from) {
    params.dateFrom = filters.dateRange.from.toISOString();
  }
  if (filters.dateRange?.to) {
    params.dateTo = filters.dateRange.to.toISOString();
  }

  // Use http client instead of fetch - handles errors automatically
  return httpClient.get<PostsResponse>("/api/v1/me/posts", { params });
}

export function useUserPosts(params: UseUserPostsParams) {
  return useQuery({
    queryKey: [
      ...QUERY_KEYS.USER_POSTS,
      params.filters,
      params.currentPage,
      params.pageSize,
    ],
    queryFn: () => fetchUserPosts(params),
    staleTime: 30000, // 30 seconds - data stays fresh
    gcTime: 5 * 60 * 1000, // 5 minutes - cache retention
  });
}
