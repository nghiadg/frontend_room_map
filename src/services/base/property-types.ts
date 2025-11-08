import { SupabaseClient } from "@supabase/supabase-js";
import { PropertyType } from "@/types/property-types";

export const getPropertyTypes = async (
  supabase: SupabaseClient
): Promise<PropertyType[]> => {
  const { data, error } = await supabase
    .from("property_types")
    .select("id, name, key, order_index, description");
  if (error) {
    throw error;
  }

  return data
    .sort((a, b) => a.order_index - b.order_index)
    .map((propertyType) => ({
      id: propertyType.id,
      name: propertyType.name,
      key: propertyType.key,
      orderIndex: propertyType.order_index,
      description: propertyType.description,
    }));
};
