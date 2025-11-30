import MapPageClient from "./page-client";
import { getPropertyTypes } from "@/services/server/property-types";
import { getAmenities } from "@/services/server/amenities";

export default async function MapPage() {
  const [propertyTypes, amenities] = await Promise.all([
    getPropertyTypes(),
    getAmenities(),
  ]);

  return <MapPageClient propertyTypes={propertyTypes} amenities={amenities} />;
}
