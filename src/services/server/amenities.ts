import { createClient } from "@/lib/supabase/server";
import { Amenity } from "@/types/amenities";
import { getAmenities as getAmenitiesBase } from "@/services/base/amenities";

export const getAmenities = async (): Promise<Amenity[]> => {
  const supabase = await createClient();
  return getAmenitiesBase(supabase);
};
