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
import { QueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-keys";
import { createClient } from "@/lib/supabase/server";
import { Post } from "@/types/post";
import camelcaseKeys from "camelcase-keys";
import { getImageUrl } from "@/lib/s3/image-url";
import Terms from "./components/terms";
import MobileFees from "./components/mobile-fees";
import { notFound } from "next/navigation";
import { POST_STATUS } from "@/constants/post-status";

export const revalidate = 900; // 15 minutes

export default async function PostDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations();

  const queryClient = new QueryClient();
  const supabase = await createClient();

  const post = await queryClient.fetchQuery({
    queryKey: QUERY_KEYS.POSTS(id),
    queryFn: async () => {
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
    },
  });

  if (!post) {
    return notFound();
  }

  const images = post.postImages.map((image) => getImageUrl(image.url)) || [];

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
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
            price={post.price}
            deposit={post.deposit}
            contactNumber={post.createdBy.phoneNumber ?? ""}
            contactZalo={post.createdBy.phoneNumber ?? ""}
            hostName={post.createdBy.fullName}
            electricityBill={post.electricityBill}
            waterBill={post.waterBill}
            internetBill={post.internetBill}
            otherBill={post.otherBill}
            waterBillUnit={post.waterBillUnit}
            internetBillUnit={post.internetBillUnit}
          />
        </div>
        <MobileBottomBookingBar
          price={post.price}
          deposit={post.deposit}
          contactNumber={post.createdBy.phoneNumber ?? ""}
          contactZalo={post.createdBy.phoneNumber ?? ""}
        />
      </div>
    </div>
  );
}
