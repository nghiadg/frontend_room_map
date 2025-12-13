import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import AddressMap from "./components/address-map";
import Amenities from "./components/amenities";
import BookingCard from "./components/booking-card";
import Description from "./components/description";
import ImageGallery from "./components/image-gallery";
import MobileBottomBookingBar from "./components/mobile-bottom-booking-bar";
import PostHeader from "./components/post-header";
import Link from "next/link";
import HostAvatar from "@/components/user/host-avatar";
import PostActions from "./components/post-actions";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { Post } from "@/types/post";
import camelcaseKeys from "camelcase-keys";
import { getImageUrl } from "@/lib/s3/image-url";
import Terms from "./components/terms";
import MobileFees from "./components/mobile-fees";
import { notFound } from "next/navigation";
import { POST_STATUS } from "@/constants/post-status";
import { Metadata } from "next";
import { APP_BRANDING, APP_NAME } from "@/constants/app-branding";
import { RealEstateListingJsonLd } from "@/components/seo/json-ld";
import { PostViewTracker } from "@/components/analytics/post-view-tracker";
import { cache } from "react";

export const revalidate = 900; // 15 minutes

/**
 * Cached function to fetch post data - prevents duplicate queries
 * between generateMetadata and page component
 */
const getPost = cache(async (id: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      id,
      title,
      description,
      address,
      lat,
      lng,
      price,
      deposit,
      electricity_bill,
      water_bill,
      internet_bill,
      other_bill,
      water_bill_unit,
      internet_bill_unit,
      created_at,
      status,
      source,
      post_amenities(id, amenities(id, name, key)),
      post_terms(id, terms(id, key, name, description)),
      post_images(id, url),
      provinces(code, name),
      districts(code, name),
      wards(code, name),
      created_by(id, full_name, phone_number)
    `
    )
    .eq("id", id)
    .neq("status", POST_STATUS.DELETED)
    .single();

  if (error?.code === "PGRST116") return null;
  if (error) throw error;
  return camelcaseKeys(data, { deep: true }) as unknown as Post;
});

/**
 * Generate dynamic metadata for each post detail page
 * This improves SEO by providing unique title/description for each listing
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    return {
      title: "Không tìm thấy bài đăng",
      description: "Bài đăng không tồn tại hoặc đã bị xóa.",
    };
  }

  const district = post.districts as { name: string } | null;
  const province = post.provinces as { name: string } | null;
  const location = [district?.name, province?.name].filter(Boolean).join(", ");

  const priceFormatted = new Intl.NumberFormat("vi-VN").format(post.price);
  const title = `${post.title} - ${priceFormatted}đ/tháng | ${APP_NAME}`;
  const description = post.description
    ? `${post.description.slice(0, 150)}... Địa chỉ: ${post.address}${location ? `, ${location}` : ""}`
    : `Cho thuê tại ${post.address}${location ? `, ${location}` : ""}. Giá ${priceFormatted}đ/tháng.`;

  const imageUrl = post.postImages?.[0]?.url
    ? getImageUrl(post.postImages[0].url)
    : APP_BRANDING.openGraph.imageUrl;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: `${APP_BRANDING.url}/posts/${id}`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: "vi_VN",
      siteName: APP_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: `${APP_BRANDING.url}/posts/${id}`,
    },
  };
}

export default async function PostDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations();

  const post = await getPost(id);

  if (!post) {
    return notFound();
  }

  const images = post.postImages.map((image) => getImageUrl(image.url)) || [];

  // Prepare data for JSON-LD structured data
  const district = post.districts as { name: string } | null;
  const province = post.provinces as { name: string } | null;

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <RealEstateListingJsonLd
        post={{
          id: post.id,
          title: post.title,
          description: post.description,
          price: post.price,
          address: post.address,
          images: images,
          createdAt: post.createdAt,
          provinceName: province?.name,
          districtName: district?.name,
        }}
      />
      <PostViewTracker
        postId={post.id}
        title={post.title}
        propertyType={(post.propertyTypes as { name: string } | null)?.name}
        price={post.price}
      />
      <Breadcrumb className="mb-4 md:mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href="/">{t("common.home")}</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <p>{t("posts.details.title")}</p>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div>
        <PostActions
          postId={post.id}
          postOwnerProfileId={post.createdBy?.id}
          postTitle={post.title}
          status={post.status}
        />
        <PostHeader
          title={post.title}
          publishedAt={post.createdAt ?? undefined}
          status={post.status}
          source={post.source}
        />
        <ImageGallery images={images} />
        <HostAvatar
          containerClassName="lg:hidden"
          name={post.createdBy?.fullName ?? ""}
          avatar="#"
        />

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 relative">
          <div className="flex-1 max-w-full">
            <AddressMap
              province={post.provinces}
              district={post.districts}
              ward={post.wards}
              address={post.address}
              lat={post.lat}
              lng={post.lng}
            />
            <Description description={post.description} />
            <Amenities
              amenities={post.postAmenities.map((amenity) => amenity.amenities)}
            />
            <Terms terms={post.postTerms.map((term) => term.terms)} />
            <MobileFees
              deposit={post.deposit}
              electricityBill={post.electricityBill}
              waterBill={post.waterBill}
              internetBill={post.internetBill}
              otherBill={post.otherBill}
              waterBillUnit={post.waterBillUnit}
              internetBillUnit={post.internetBillUnit}
            />
          </div>
          <BookingCard
            postId={post.id}
            price={post.price}
            deposit={post.deposit}
            contactNumber={post.createdBy?.phoneNumber ?? ""}
            contactZalo={post.createdBy?.phoneNumber ?? ""}
            hostName={post.createdBy?.fullName ?? ""}
            electricityBill={post.electricityBill}
            waterBill={post.waterBill}
            internetBill={post.internetBill}
            otherBill={post.otherBill}
            waterBillUnit={post.waterBillUnit}
            internetBillUnit={post.internetBillUnit}
          />
        </div>
        <MobileBottomBookingBar
          postId={post.id}
          price={post.price}
          deposit={post.deposit}
          contactNumber={post.createdBy?.phoneNumber ?? ""}
          contactZalo={post.createdBy?.phoneNumber ?? ""}
        />
      </div>
    </div>
  );
}
