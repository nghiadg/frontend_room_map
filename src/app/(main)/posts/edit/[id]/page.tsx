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
import { getAmenities } from "@/services/server/amenities";
import { getPropertyTypes } from "@/services/server/property-types";
import { getTerms } from "@/services/server/terms";
import { getPost } from "@/services/server/posts";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations();
  const queryClient = new QueryClient();

  const amenities = await queryClient.fetchQuery({
    queryKey: QUERY_KEYS.AMENITIES,
    queryFn: getAmenities,
  });

  const propertyTypes = await queryClient.fetchQuery({
    queryKey: QUERY_KEYS.PROPERTY_TYPES,
    queryFn: getPropertyTypes,
  });

  const terms = await queryClient.fetchQuery({
    queryKey: QUERY_KEYS.TERMS,
    queryFn: getTerms,
  });

  const post = await queryClient.fetchQuery({
    queryKey: QUERY_KEYS.POSTS(id),
    queryFn: () => getPost(id),
  });

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
