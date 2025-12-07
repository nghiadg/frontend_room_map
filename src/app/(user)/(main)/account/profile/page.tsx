import ProfileFormProvider from "@/components/user/profile-form/profile-form-provider";
import { QUERY_KEYS } from "@/constants/query-keys";
import { createClient } from "@/lib/supabase/server";
import { UserProfile } from "@/types/profile";
import { Role } from "@/types/role";
import { getRoleName } from "@/constants/user-role";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import ProfilePageClient from "./page-client";
import { GENDER } from "@/constants/gender";
import camelcaseKeys from "camelcase-keys";

export default async function ProfilePage() {
  const queryClient = new QueryClient();
  const supabase = await createClient();

  // Fetch profile and roles in parallel
  const [profile, roles] = await Promise.all([
    queryClient.fetchQuery({
      queryKey: QUERY_KEYS.USER_PROFILE,
      queryFn: async () => {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("Unauthorized");

        const { data, error } = await supabase
          .from("profiles")
          .select(
            `id, full_name, gender, role_id, date_of_birth, phone_number, provinces(*), districts(*), wards(*), address`
          )
          .eq("user_id", user.id)
          .limit(1)
          .single();

        if (error) throw error;
        return camelcaseKeys(data, { deep: true }) as unknown as UserProfile;
      },
    }),
    (async () => {
      const { data, error } = await supabase
        .from("roles")
        .select("id, name")
        .in("name", ["renter", "lessor"])
        .order("id", { ascending: true });

      if (error) throw error;
      return data as Role[];
    })(),
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
