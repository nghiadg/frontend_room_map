import { createClient } from "@/lib/supabase/server";
import { getPropertyTypes as getPropertyTypesBase } from "@/services/base/property-types";
import { PropertyType } from "@/types/property-types";

export const getPropertyTypes = async (): Promise<PropertyType[]> => {
  const supabase = await createClient();
  return getPropertyTypesBase(supabase);
};
