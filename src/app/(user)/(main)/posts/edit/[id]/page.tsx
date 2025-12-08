import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import EditPostPageClient from "./page-client";
import { QUERY_KEYS } from "@/constants/query-keys";
import { QueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/server";
import { Amenity } from "@/types/amenities";
import { PropertyType } from "@/types/property-types";
import { Term } from "@/types/terms";
import { Post } from "@/types/post";
import { notFound } from "next/navigation";
import camelcaseKeys from "camelcase-keys";
import { POST_STATUS } from "@/constants/post-status";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations();
  const queryClient = new QueryClient();
  const supabase = await createClient();

  const amenities = await queryClient.fetchQuery({
    queryKey: QUERY_KEYS.AMENITIES,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("amenities")
        .select("id, name, key, order_index");
      if (error) throw error;
      return data
        .sort((a, b) => a.order_index - b.order_index)
        .map((a) => ({
          id: a.id,
          name: a.name,
          key: a.key,
          orderIndex: a.order_index,
        })) as Amenity[];
    },
  });

  const propertyTypes = await queryClient.fetchQuery({
    queryKey: QUERY_KEYS.PROPERTY_TYPES,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("property_types")
        .select("id, name, key, order_index, description");
      if (error) throw error;
      return data
        .sort((a, b) => a.order_index - b.order_index)
        .map((pt) => ({
          id: pt.id,
          name: pt.name,
          key: pt.key,
          orderIndex: pt.order_index,
          description: pt.description,
        })) as PropertyType[];
    },
  });

  const terms = await queryClient.fetchQuery({
    queryKey: QUERY_KEYS.TERMS,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("terms")
        .select("id, name, description, key");
      if (error) throw error;
      return data as Term[];
    },
  });

  const post = await queryClient.fetchQuery({
    queryKey: QUERY_KEYS.POSTS(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(
          "*, post_amenities(*, amenities(*)), post_terms(*, terms(*)), post_images(*), provinces(*), districts(*), wards(*), created_by(*)"
        )
        .eq("id", id)
        .eq("status", POST_STATUS.ACTIVE)
        .single();
      if (error?.code === "PGRST116") return null;
      if (error) throw error;
      return camelcaseKeys(data, { deep: true }) as unknown as Post;
    },
  });

  if (!post) {
    return notFound();
  }

  return (
    <div className="w-full">
      <Breadcrumb className="mb-4 md:mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href="/">{t("common.home")}</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <p>{t("posts.edit.title")}</p>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <EditPostPageClient
        amenities={amenities}
        propertyTypes={propertyTypes}
        terms={terms}
        post={post}
      />
    </div>
  );
}
