import { createClient } from "@/lib/supabase/server";
import { getPost as getPostBase } from "@/services/base/posts";

export const getPost = async (id: string) => {
  const supabase = await createClient();
  return getPostBase(supabase, id);
};
