import { createSupabaseClient } from "@/lib/supabase/client";
import { getPropertyTypes as getPropertyTypesBase } from "@/services/base/property-types";
import { PropertyType } from "@/types/property-types";

const supabase = createSupabaseClient();

export const getPropertyTypes = async (): Promise<PropertyType[]> => {
  return getPropertyTypesBase(supabase);
};
