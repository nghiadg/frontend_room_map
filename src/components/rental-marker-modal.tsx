import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useViewImages } from "@/store/view-images-store";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { PostMapMarker } from "@/services/client/posts";
import {
  formatVietnamCurrency,
  formatCurrencyWithUnit,
  formatFullAddress,
} from "@/lib/utils/currency";
import { formatRelativeDate } from "@/lib/utils/date";
import { PostInfoRow } from "./post-info-row";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80";

// Navigation button styling helper
const getNavButtonClassName = (
  canScroll: boolean,
  position: "left" | "right"
) =>
  cn(
    "absolute top-1/2 -translate-y-1/2 text-white bg-black/50 rounded-full p-2 z-10 transition-opacity",
    position === "left" ? "left-1" : "right-1",
    canScroll ? "cursor-pointer opacity-100" : "cursor-not-allowed opacity-30"
  );

type RentalMarkerModalProps = {
  post: PostMapMarker;
};

export const RentalMarkerModal = NiceModal.create<RentalMarkerModalProps>(
  ({ post }) => {
    const modal = useModal();
    const t = useTranslations();
    const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
    const [currentImage, setCurrentImage] = useState<number>(0);
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);
    const { onOpen: onOpenViewImages } = useViewImages();

    // Use post images or fallback to placeholder
    const images = post.images.length > 0 ? post.images : [PLACEHOLDER_IMAGE];
    const fullAddress = formatFullAddress(
      post.address,
      post.wardName,
      post.districtName,
      post.provinceName
    );

    const handlePrevious = () => {
      if (carouselApi?.canScrollPrev()) {
        carouselApi?.scrollPrev();
        setCurrentImage(carouselApi?.selectedScrollSnap() + 1);
      }
    };

    const handleNext = () => {
      if (carouselApi?.canScrollNext()) {
        carouselApi?.scrollNext();
        setCurrentImage(carouselApi?.selectedScrollSnap() + 1);
      }
    };

    const handleViewAllImages = () => {
      onOpenViewImages(images, currentImage);
    };

    useEffect(() => {
      if (!carouselApi) return;

      const updateState = () => {
        setCurrentImage(carouselApi.selectedScrollSnap() + 1);
        setCanScrollPrev(carouselApi.canScrollPrev());
        setCanScrollNext(carouselApi.canScrollNext());
      };

      updateState();
      carouselApi.on("select", updateState);
      carouselApi.on("reInit", updateState);

      return () => {
        carouselApi.off("select", updateState);
        carouselApi.off("reInit", updateState);
      };
    }, [carouselApi]);

    return (
      <Sheet open={modal.visible} onOpenChange={modal.hide}>
        <SheetContent
          side="bottom"
          className="max-h-[85vh] flex flex-col"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <SheetHeader className="shrink-0">
            <SheetTitle>{t("common.quick_view")}</SheetTitle>
          </SheetHeader>
          {/* Content Section - Scrollable */}
          <div className="flex-1 overflow-y-auto px-4">
            <div className="flex flex-col gap-3">
              {/* Image Carousel */}
              <div className="overflow-hidden rounded-xl relative aspect-4/3">
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={!canScrollPrev}
                  className={getNavButtonClassName(canScrollPrev, "left")}
                  aria-label={t("common.previous")}
                  aria-disabled={!canScrollPrev}
                >
                  <ChevronLeftIcon className="w-5 h-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!canScrollNext}
                  className={getNavButtonClassName(canScrollNext, "right")}
                  aria-label={t("common.next")}
                  aria-disabled={!canScrollNext}
                >
                  <ChevronRightIcon className="w-5 h-5" aria-hidden="true" />
                </button>
                <div className="absolute bottom-2 right-2 text-sm text-white bg-black/60 rounded-full px-3 py-1 z-10 font-medium">
                  {currentImage} / {images.length}
                </div>
                <Carousel setApi={setCarouselApi}>
                  <CarouselContent>
                    {images.map((image, idx) => (
                      <CarouselItem key={idx} onClick={handleViewAllImages}>
                        <div className="relative w-full h-full aspect-4/3 bg-gray-100 rounded-xl overflow-hidden">
                          <Image
                            src={image}
                            alt={`${post.title} - ${t("common.image")} ${idx + 1}`}
                            fill
                            className="object-contain"
                            loading="lazy"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </div>

              {/* Property Info */}
              <div className="flex flex-col gap-2">
                {/* Title */}
                <h3
                  className="text-base font-semibold line-clamp-2 leading-snug"
                  title={post.title}
                >
                  {post.title}
                </h3>

                {/* Description */}
                <p
                  className="text-sm text-muted-foreground line-clamp-2 leading-relaxed"
                  title={post.description}
                >
                  {post.description}
                </p>

                {/* Price Card */}
                <div className="rounded-lg py-2 px-3 bg-primary/10 inline-block">
                  <p className="text-primary font-bold text-base">
                    {formatCurrencyWithUnit(post.price, "tháng")}
                  </p>
                  {post.deposit > 0 && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t("common.deposit")}:{" "}
                      {formatVietnamCurrency(post.deposit)}
                    </p>
                  )}
                </div>

                {/* Location & Contact */}
                <div className="flex flex-col gap-1.5">
                  <PostInfoRow icon={MapPinIcon}>
                    <span className="line-clamp-1" title={fullAddress}>
                      {fullAddress}
                    </span>
                  </PostInfoRow>
                  {post.posterName && (
                    <PostInfoRow icon={UserIcon}>
                      <span className="font-medium">{post.posterName}</span>
                    </PostInfoRow>
                  )}
                  {post.phone && (
                    <PostInfoRow icon={PhoneIcon}>
                      <span className="font-medium">{post.phone}</span>
                    </PostInfoRow>
                  )}
                  {post.createdAt && (
                    <PostInfoRow icon={CalendarIcon}>
                      <span className="font-medium">
                        {formatRelativeDate(post.createdAt)}
                      </span>
                    </PostInfoRow>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons - Fixed at bottom */}
          <SheetFooter className="shrink-0 flex-row gap-3 px-4 pt-3 pb-2 border-t mt-2">
            {post.phone && (
              <a
                href={`tel:${post.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button
                  variant="outline"
                  size="default"
                  className="w-full h-10 text-sm gap-1.5"
                >
                  <PhoneIcon className="w-4 h-4" aria-hidden="true" />
                  {t("common.call_now")}
                </Button>
              </a>
            )}
            <Link href={`/posts/${post.id}`} className="flex-1">
              <Button
                variant="default"
                size="default"
                className="w-full h-10 text-sm gap-1.5"
              >
                <ExternalLinkIcon className="w-4 h-4" aria-hidden="true" />
                {t("common.view_details")}
              </Button>
            </Link>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  }
);
