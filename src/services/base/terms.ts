import { SupabaseClient } from "@supabase/supabase-js";
import { Term } from "@/types/terms";

export const getTerms = async (supabase: SupabaseClient): Promise<Term[]> => {
  const { data, error } = await supabase
    .from("terms")
    .select("id, name, description, key");
  if (error) {
    throw error;
  }

  return data;
};
