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
          name: profile.fullName,
          gender: profile.gender as (typeof GENDER)[keyof typeof GENDER],
          birthday: profile.dateOfBirth
            ? new Date(profile.dateOfBirth)
            : undefined,
          phone: profile.phoneNumber ?? "",
          province: profile.provinces,
          district: profile.districts,
          ward: profile.wards,
          address: profile.address ?? "",
        }}
      >
        <ProfilePageClient />
      </ProfileFormProvider>
    </HydrationBoundary>
  );
}
