import { createClient } from "@/lib/supabase/server";
import { Role } from "@/types/role";

export const getRoles = async (): Promise<Role[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("roles")
    .select("id, name")
    .in("name", ["renter", "lessor"]) // Only fetch user-selectable roles
    .order("id", { ascending: true });

  if (error) {
    throw error;
  }

  return data || [];
};
