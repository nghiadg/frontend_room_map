import { createSupabaseClient } from "@/lib/supabase/client";
import { District, Province, Ward } from "@/types/location";
const supabase = createSupabaseClient();

export const getProvinces = async (): Promise<Province[]> => {
  const { data, error } = await supabase.from("provinces").select("*");
  if (error) {
    throw error;
  }
  // mapping data first form snake_case to camelCase
  const provinces: Province[] = data.map((province) => ({
    code: province.code,
    name: province.name,
  }));

  return provinces;
};

export const getDistricts = async (
  provinceCode: string
): Promise<District[]> => {
  const { data, error } = await supabase
    .from("districts")
    .select("*")
    .eq("province_code", provinceCode);
  if (error) {
    throw error;
  }

  const districts: District[] = data.map((district) => ({
    code: district.code,
    name: district.name,
    provinceCode: district.province_code,
  }));

  return districts;
};

export const getWards = async (districtCode: string): Promise<Ward[]> => {
  const { data, error } = await supabase
    .from("wards")
    .select("*")
    .eq("district_code", districtCode);
  if (error) {
    throw error;
  }
  const wards: Ward[] = data.map((ward) => ({
    code: ward.code,
    name: ward.name,
    districtCode: ward.district_code,
  }));

  return wards;
};
