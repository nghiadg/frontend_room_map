import { MapboxGeocodingForwardResponse } from "@/app/api/v1/mapbox/types";
import HttpClient from "@/lib/http-client";

const httpClient = new HttpClient();

export const getMapboxGeocodingForward = async (
  query: string,
  abortSignal?: AbortSignal
) => {
  const params = new URLSearchParams({
    query,
  });

  const response = await httpClient.request<MapboxGeocodingForwardResponse>(
    `/api/v1/mapbox/geocoding-forward?${params.toString()}`,
    {
      signal: abortSignal,
    }
  );

  return response;
};
