import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-keys";

type BumpPostParams = {
  postId: number;
};

type BumpPostResponse = {
  success: boolean;
  message: string;
  expiresAt: string;
};

/**
 * Admin-only: Bumps (renews) a post for another 14 days.
 * Sets status to 'active' and extends expires_at.
 */
async function adminBumpPost(
  params: BumpPostParams
): Promise<BumpPostResponse> {
  const response = await fetch(`/api/v1/admin/posts/${params.postId}/bump`, {
    method: "POST",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to bump post");
  }

  return response.json();
}

/**
 * Hook for admin to bump (renew) a post.
 * Invalidates admin posts list on success.
 */
export function useAdminBumpPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminBumpPost,
    onSuccess: () => {
      // Invalidate admin posts list to refetch data
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ADMIN_POSTS,
      });
    },
  });
}
