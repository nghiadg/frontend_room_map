import { createClient } from "@/lib/supabase/server";
import { Term } from "@/types/terms";
import { getTerms as getTermsBase } from "@/services/base/terms";

export const getTerms = async (): Promise<Term[]> => {
  const supabase = await createClient();
  return getTermsBase(supabase);
};
