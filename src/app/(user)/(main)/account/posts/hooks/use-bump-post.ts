import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-keys";

type BumpPostParams = {
  postId: number;
};

type BumpPostResponse = {
  message: string;
  expiresAt: string;
};

/**
 * Bumps (renews) a post for another 14 days.
 * Sets status to 'active' and extends expires_at.
 */
async function bumpPost(params: BumpPostParams): Promise<BumpPostResponse> {
  const response = await fetch(`/api/v1/posts/${params.postId}/bump`, {
    method: "POST",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to bump post");
  }

  return response.json();
}

/**
 * Hook to bump (renew) a post.
 * Invalidates user's posts list on success.
 *
 * @example
 * ```tsx
 * const { mutate: bump, isPending } = useBumpPost();
 *
 * bump({ postId: 123 }, {
 *   onSuccess: (data) => { toast.success("Post renewed!"); },
 *   onError: () => { toast.error("Failed to renew"); },
 * });
 * ```
 */
export function useBumpPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bumpPost,
    onSuccess: () => {
      // Invalidate user's posts list to refetch data
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.USER_POSTS,
      });
    },
  });
}
