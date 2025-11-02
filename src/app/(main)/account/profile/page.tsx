import ProfileFormProvider from "@/components/profile-form/profile-form-provider";
import { QUERY_KEYS } from "@/constants/query-keys";
import { getUserProfile } from "@/services/server/profile";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import ProfilePageClient from "./page-client";
import { GENDER } from "@/constants/gender";

export default async function ProfilePage() {
  const queryClient = new QueryClient();
  const profile = await queryClient.fetchQuery({
    queryKey: QUERY_KEYS.USER_PROFILE,
    queryFn: getUserProfile,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfileFormProvider
        defaultValues={{
          name: profile.full_name,
          gender: profile.gender as (typeof GENDER)[keyof typeof GENDER],
          birthday: profile.date_of_birth
            ? new Date(profile.date_of_birth)
            : undefined,
          phone: profile.phone_number ?? "",
          province: profile.province,
          district: profile.district,
          ward: profile.ward,
          address: profile.address ?? "",
        }}
      >
        <ProfilePageClient />
      </ProfileFormProvider>
    </HydrationBoundary>
  );
}
