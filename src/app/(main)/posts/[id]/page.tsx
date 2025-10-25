"use client";

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
import PropertyDetails from "./components/property-details";
import Link from "next/link";
import { useTranslations } from "next-intl";
import HostAvatar from "@/components/host-avatar";
import PostActions from "./components/post-actions";

export default function PostDetailsPage() {
  const t = useTranslations();
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
        <PostActions />
        <PostHeader />
        <ImageGallery />
        <HostAvatar
          containerClassName="lg:hidden"
          name="Nguyễn Văn A"
          avatar="https://www.bhg.com/thmb/H9VV9JNnKl-H1faFXnPlQfNprYw=/1799x0/filters:no_upscale():strip_icc()/white-modern-house-curved-patio-archway-c0a4a3b3-aa51b24d14d0464ea15d36e05aa85ac9.jpg"
        />

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 relative">
          <div className="flex-1 max-w-full">
            <AddressMap />
            <PropertyDetails />
            <Description />
            <Amenities />
          </div>
          <BookingCard />
        </div>
        <MobileBottomBookingBar />
      </div>
    </div>
  );
}
