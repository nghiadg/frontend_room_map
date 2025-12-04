import MapPageClient from "./page-client";
import { createClient } from "@/lib/supabase/server";
import { PropertyType } from "@/types/property-types";
import { Amenity } from "@/types/amenities";

export default async function MapPage() {
  const supabase = await createClient();
  const [propertyTypes, amenities] = await Promise.all([
    (async () => {
      const { data, error } = await supabase
        .from("property_types")
        .select("id, name, key, order_index, description");
      if (error) throw error;
      return data
        .sort((a, b) => a.order_index - b.order_index)
        .map((pt) => ({
          id: pt.id,
          name: pt.name,
          key: pt.key,
          orderIndex: pt.order_index,
          description: pt.description,
        })) as PropertyType[];
    })(),
    (async () => {
      const { data, error } = await supabase
        .from("amenities")
        .select("id, name, key, order_index");
      if (error) throw error;
      return data
        .sort((a, b) => a.order_index - b.order_index)
        .map((a) => ({
          id: a.id,
          name: a.name,
          key: a.key,
          orderIndex: a.order_index,
        })) as Amenity[];
    })(),
  ]);

  return <MapPageClient propertyTypes={propertyTypes} amenities={amenities} />;
}
