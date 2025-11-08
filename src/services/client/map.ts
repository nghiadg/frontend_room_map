import { MapboxGeocodingForwardResponse } from "@/app/api/v1/mapbox/types";
import HttpClient from "@/lib/http-client";

const httpClient = new HttpClient();

export const getMapboxGeocodingForward = async (query: string) => {
  const params = new URLSearchParams({
    query,
  });

  const response = await httpClient.request<MapboxGeocodingForwardResponse>(
    `/mapbox/geocoding-forward?${params.toString()}`
  );

  return response;
};
