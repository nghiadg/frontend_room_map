import MapPageClient from "./page-client";
import { createClient } from "@/lib/supabase/server";
import { PropertyType } from "@/types/property-types";
import { Amenity } from "@/types/amenities";
import { Metadata } from "next";
import { APP_BRANDING, APP_NAME } from "@/constants/app-branding";

/**
 * Static metadata for map page - optimized for Vietnamese SEO
 */
export const metadata: Metadata = {
  title: `Bản đồ thuê nhà Việt Nam | ${APP_NAME}`,
  description:
    "Khám phá bản đồ tương tác với hàng ngàn bài đăng cho thuê nhà, căn hộ, phòng trọ trên toàn Việt Nam. Tìm kiếm theo khu vực, giá, tiện ích.",
  keywords: [
    "bản đồ thuê nhà",
    "cho thuê phòng trọ",
    "tìm nhà thuê",
    "thuê căn hộ Việt Nam",
    "phòng trọ gần đây",
    "rental map Vietnam",
  ],
  alternates: {
    canonical: `${APP_BRANDING.url}/map`,
  },
  openGraph: {
    title: `Bản đồ thuê nhà Việt Nam | ${APP_NAME}`,
    description:
      "Khám phá bản đồ tương tác với hàng ngàn bài đăng cho thuê nhà, căn hộ, phòng trọ.",
    type: "website",
    url: `${APP_BRANDING.url}/map`,
    siteName: APP_NAME,
    locale: "vi_VN",
  },
};

export default async function MapPage() {
  const supabase = await createClient();

  const [propertyTypesResult, amenitiesResult] = await Promise.all([
    supabase
      .from("property_types")
      .select("id, name, key, order_index, description"),
    supabase.from("amenities").select("id, name, key, order_index"),
  ]);

  if (propertyTypesResult.error) throw propertyTypesResult.error;
  if (amenitiesResult.error) throw amenitiesResult.error;

  const propertyTypes = propertyTypesResult.data
    .sort((a, b) => a.order_index - b.order_index)
    .map((pt) => ({
      id: pt.id,
      name: pt.name,
      key: pt.key,
      orderIndex: pt.order_index,
      description: pt.description,
    })) as PropertyType[];

  const amenities = amenitiesResult.data
    .sort((a, b) => a.order_index - b.order_index)
    .map((a) => ({
      id: a.id,
      name: a.name,
      key: a.key,
      orderIndex: a.order_index,
    })) as Amenity[];

  return <MapPageClient propertyTypes={propertyTypes} amenities={amenities} />;
}
