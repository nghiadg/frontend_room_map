"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient, HttpClientError } from "@/lib/http-client";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

type LockUserParams = {
  profileId: number;
  isLocked: boolean;
};

type LockUserResponse = {
  success: boolean;
  isLocked: boolean;
  message: string;
};

async function lockUser(params: LockUserParams): Promise<LockUserResponse> {
  return httpClient.patch<LockUserResponse>(
    `/api/v1/admin/users/${params.profileId}/lock`,
    { isLocked: params.isLocked }
  );
}

export function useLockUser() {
  const queryClient = useQueryClient();
  const t = useTranslations();

  return useMutation({
    mutationFn: lockUser,
    onSuccess: (data) => {
      // Invalidate admin users list to refresh data
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });

      toast.success(
        data.isLocked
          ? t("admin.users.lock.success")
          : t("admin.users.unlock.success")
      );
    },
    onError: (error: HttpClientError) => {
      toast.error(error.message || t("admin.users.lock.error"));
    },
  });
}
