import HttpClient from "@/lib/http-client";
import { PropertyType } from "@/types/property-types";
import { Amenity } from "@/types/amenities";

const httpClient = new HttpClient();

export const getPropertyTypesClient = async (): Promise<PropertyType[]> => {
  const propertyTypes = await httpClient.request<PropertyType[]>(
    "/api/v1/property-types"
  );
  return propertyTypes;
};

export const getAmenitiesClient = async (): Promise<Amenity[]> => {
  const amenities = await httpClient.request<Amenity[]>("/api/v1/amenities");
  return amenities;
};
