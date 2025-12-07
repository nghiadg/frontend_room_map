import { useMutation, useQueryClient } from "@tanstack/react-query";
import HttpClient from "@/lib/http-client";

const httpClient = new HttpClient();

type DeletePostParams = {
  postId: number;
  reason: string;
};

async function deletePost(
  params: DeletePostParams
): Promise<{ success: boolean }> {
  return httpClient.delete(`/api/v1/admin/posts/${params.postId}`, {
    data: { reason: params.reason },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      // Invalidate admin posts query to refetch data
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
    },
  });
}
