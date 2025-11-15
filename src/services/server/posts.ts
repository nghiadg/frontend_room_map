import { createClient } from "@/lib/supabase/server";
import {
  getPostById as getPublicPostById,
  getOwnedPostById as getOwnedPostBase,
} from "@/services/base/posts";

export const getPostById = async (id: string) => {
  const supabase = await createClient();
  return getPublicPostById(supabase, id);
};

export const getOwnedPostById = async (id: string) => {
  const supabase = await createClient();
  return getOwnedPostBase(supabase, id);
};
