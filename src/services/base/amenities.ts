import { SupabaseClient } from "@supabase/supabase-js";
import { Amenity } from "@/types/amenities";

export const getAmenities = async (
  supabase: SupabaseClient
): Promise<Amenity[]> => {
  const { data, error } = await supabase
    .from("amenities")
    .select("id, name, key, order_index");
  if (error) {
    throw error;
  }

  return data
    .sort((a, b) => a.order_index - b.order_index)
    .map((amenity) => ({
      id: amenity.id,
      name: amenity.name,
      key: amenity.key,
      orderIndex: amenity.order_index,
    }));
};
