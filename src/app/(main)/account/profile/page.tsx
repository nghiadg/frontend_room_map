import ProfileFormProvider from "@/components/profile-form/profile-form-provider";
import { QUERY_KEYS } from "@/constants/query-keys";
import { getUserProfile } from "@/services/server/profile";
import { getRoles } from "@/services/base/roles";
import { getRoleName } from "@/constants/user-role";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import ProfilePageClient from "./page-client";
import { GENDER } from "@/constants/gender";

export default async function ProfilePage() {
  const queryClient = new QueryClient();

  // Fetch profile and roles in parallel
  const [profile, roles] = await Promise.all([
    queryClient.fetchQuery({
      queryKey: QUERY_KEYS.USER_PROFILE,
      queryFn: getUserProfile,
    }),
    getRoles(), // Fetch directly, don't prefetch (won't be used client-side)
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfileFormProvider
        roles={roles}
        defaultValues={{
          name: profile.fullName,
          gender: profile.gender as (typeof GENDER)[keyof typeof GENDER],
          role: profile.roleId
            ? (getRoleName(roles, profile.roleId) as
                | "renter"
                | "lessor"
                | undefined)
            : undefined,
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
        <ProfilePageClient roles={roles} />
      </ProfileFormProvider>
    </HydrationBoundary>
  );
}
