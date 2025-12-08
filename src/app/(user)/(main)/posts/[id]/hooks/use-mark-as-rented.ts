import { useMutation, useQueryClient } from "@tanstack/react-query";
import HttpClient from "@/lib/http-client";
import { QUERY_KEYS } from "@/constants/query-keys";

const httpClient = new HttpClient();

type MarkAsRentedParams = {
  postId: number;
};

type MarkAsRentedResponse = {
  message: string;
};

/**
 * Marks a post as rented by calling the API endpoint.
 */
async function markAsRented(
  params: MarkAsRentedParams
): Promise<MarkAsRentedResponse> {
  return httpClient.request(`/api/v1/posts/${params.postId}/mark-as-rented`, {
    method: "PATCH",
  });
}

/**
 * Hook to mark a post as rented.
 * Invalidates both the specific post query and user's posts list on success.
 *
 * @example
 * ```tsx
 * const { mutate: markAsRented, isPending } = useMarkAsRented();
 *
 * markAsRented({ postId: 123 }, {
 *   onSuccess: () => { toast.success("Done!"); },
 *   onError: () => { toast.error("Failed"); },
 * });
 * ```
 */
export function useMarkAsRented() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAsRented,
    onSuccess: (_data, variables) => {
      // Invalidate the specific post query to refetch updated data
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.POSTS(variables.postId.toString()),
      });
      // Also invalidate user's posts list if they go back to manage posts
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.USER_POSTS,
      });
    },
  });
}
