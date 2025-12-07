"use client";

import {
  ProfileForm,
  ProfileFormData,
} from "@/components/user/profile-form/profile-form";
import { Button } from "@/components/ui/button";
import { QUERY_KEYS } from "@/constants/query-keys";
import { getRoleId } from "@/constants/user-role";
import { getUserProfile, updateUserProfile } from "@/services/client/profile";
import { UpdateUserProfileData } from "@/services/types/profile";
import { Role } from "@/types/role";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { useLoadingGlobal } from "@/store/loading-store";

export default function ProfilePageClient({ roles }: { roles: Role[] }) {
  const t = useTranslations();
  const {
    handleSubmit,
    formState: { isDirty },
  } = useFormContext<ProfileFormData>();
  const queryClient = useQueryClient();
  const { setIsLoading } = useLoadingGlobal();

  const { data: userProfile } = useQuery({
    queryKey: QUERY_KEYS.USER_PROFILE,
    queryFn: getUserProfile,
    refetchOnMount: false,
  });

  const updateProfile = useMutation({
    mutationFn: (data: UpdateUserProfileData) => updateUserProfile(data),
    onSuccess: () => {
      toast.success(t("profile.setup.success"));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_PROFILE });
    },
    onError: () => {
      toast.error(t("profile.setup.error"));
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    if (!userProfile) {
      return;
    }
    setIsLoading(true);

    const payload: UpdateUserProfileData = {
      full_name: data.name,
      gender: data.gender,
      role_id: data.role ? getRoleId(roles, data.role) : undefined,
      date_of_birth: data.birthday?.toISOString(),
      phone_number: data.phone ?? undefined,
      province_code: data.province?.code,
      district_code: data.district?.code,
      ward_code: data.ward?.code,
      address: data.address,
    };

    updateProfile.mutate(payload);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {t("account.profile.heading")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("account.profile.description")}
        </p>
      </div>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
        <ProfileForm
          heading={t("account.profile.heading")}
          description={t("account.profile.description")}
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            type="submit"
            className="w-full sm:w-auto"
            disabled={updateProfile.isPending || !isDirty}
          >
            {t("account.profile.submit")}
          </Button>
        </div>
      </form>
    </div>
  );
}
