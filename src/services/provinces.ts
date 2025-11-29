import HttpClient from "@/lib/http-client";
import { District, Province, Ward } from "@/types/location";

const httpClient = new HttpClient();

export const getProvinces = async (): Promise<Province[]> => {
  const provinces = await httpClient.request<Province[]>(
    "/locations/provinces"
  );
  return provinces;
};

export const getDistricts = async (
  provinceCode: string
): Promise<District[]> => {
  const districts = await httpClient.request<District[]>(
    `/locations/provinces/${provinceCode}/districts`
  );
  return districts;
};

export const getWards = async (districtCode: string): Promise<Ward[]> => {
  const wards = await httpClient.request<Ward[]>(
    `/locations/districts/${districtCode}/wards`
  );
  return wards;
};
