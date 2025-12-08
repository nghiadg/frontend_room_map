import { useMutation, useQueryClient } from "@tanstack/react-query";
import HttpClient from "@/lib/http-client";
import { QUERY_KEYS } from "@/constants/query-keys";

const httpClient = new HttpClient();

type DeleteUserPostParams = {
  postId: number;
};

type DeleteUserPostResponse = {
  message: string;
};

/**
 * Deletes a user's own post by calling the API endpoint.
 */
async function deleteUserPost(
  params: DeleteUserPostParams
): Promise<DeleteUserPostResponse> {
  return httpClient.delete(`/api/v1/posts/${params.postId}`);
}

/**
 * Hook to delete a user's own post.
 * Invalidates user's posts list on success.
 *
 * @example
 * ```tsx
 * const { mutate: deletePost, isPending } = useDeleteUserPost();
 *
 * deletePost({ postId: 123 }, {
 *   onSuccess: () => { toast.success("Deleted!"); },
 *   onError: () => { toast.error("Failed"); },
 * });
 * ```
 */
export function useDeleteUserPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUserPost,
    onSuccess: () => {
      // Invalidate user's posts list to refetch data
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.USER_POSTS,
      });
    },
  });
}
