import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import CreatePostPageClient from "./page-client";
import { QUERY_KEYS } from "@/constants/query-keys";
import { QueryClient } from "@tanstack/react-query";
import { getAmenities } from "@/services/server/amenities";
import { getPropertyTypes } from "@/services/server/property-types";
import { getTerms } from "@/services/server/terms";

export default async function CreatePostPage() {
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

  return (
    <div className="w-full">
      <Breadcrumb className="mb-4 md:mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href="/">{t("common.home")}</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <p>{t("posts.create.title")}</p>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <CreatePostPageClient
        amenities={amenities}
        propertyTypes={propertyTypes}
        terms={terms}
      />
    </div>
  );
}
