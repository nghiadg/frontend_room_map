import { useMutation, useQueryClient } from "@tanstack/react-query";
import HttpClient from "@/lib/http-client";
import { QUERY_KEYS } from "@/constants/query-keys";
import { PostStatus } from "@/constants/post-status";

const httpClient = new HttpClient();

type ToggleVisibilityParams = {
  postId: number;
};

type ToggleVisibilityResponse = {
  message: string;
  status: PostStatus;
};

/**
 * Toggles post visibility between 'active' and 'hidden'.
 */
async function togglePostVisibility(
  params: ToggleVisibilityParams
): Promise<ToggleVisibilityResponse> {
  return httpClient.patch(`/api/v1/posts/${params.postId}/toggle-visibility`);
}

/**
 * Hook to toggle post visibility.
 * Invalidates user's posts list on success.
 *
 * @example
 * ```tsx
 * const { mutate: toggleVisibility, isPending } = useTogglePostVisibility();
 *
 * toggleVisibility({ postId: 123 }, {
 *   onSuccess: (data) => { toast.success(data.status === 'hidden' ? "Hidden!" : "Visible!"); },
 *   onError: () => { toast.error("Failed"); },
 * });
 * ```
 */
export function useTogglePostVisibility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: togglePostVisibility,
    onSuccess: () => {
      // Invalidate user's posts list to refetch data
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.USER_POSTS,
      });
    },
  });
}
