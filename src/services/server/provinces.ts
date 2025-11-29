import { createClient } from "@/lib/supabase/server";
import { Province } from "@/types/location";

export const getProvinces = async (): Promise<Province[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("provinces").select("code, name");
  if (error) {
    throw error;
  }

  const provinces: Province[] = data.map((province) => ({
    code: province.code,
    name: province.name,
  }));
  return provinces;
};
