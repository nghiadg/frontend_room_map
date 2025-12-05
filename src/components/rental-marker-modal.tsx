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
  ChevronLeftIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
  MapPinIcon,
  PhoneIcon,
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
          className="max-h-full"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <SheetHeader>
            <SheetTitle>{t("common.quick_view")}</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-2 px-4">
            <div className="overflow-hidden rounded-md relative aspect-4/3">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={!canScrollPrev}
                className={getNavButtonClassName(canScrollPrev, "left")}
                aria-label="Previous image"
                aria-disabled={!canScrollPrev}
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={!canScrollNext}
                className={getNavButtonClassName(canScrollNext, "right")}
                aria-label="Next image"
                aria-disabled={!canScrollNext}
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
              <div>
                <div className="absolute bottom-1 right-1 text-xs text-white bg-black/50 rounded-full px-2 py-0.5 z-10 cursor-pointer">
                  {currentImage} / {images.length}
                </div>
              </div>
              <Carousel setApi={setCarouselApi}>
                <CarouselContent>
                  {images.map((image, idx) => (
                    <CarouselItem key={idx} onClick={handleViewAllImages}>
                      <div className="relative w-full h-full aspect-4/3 bg-gray-100 rounded-md overflow-hidden">
                        <Image
                          src={image}
                          alt={`Property image ${idx + 1}`}
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

            <div className="flex flex-col gap-1.5">
              <p
                className="text-sm font-semibold line-clamp-1"
                title={post.title}
              >
                {post.title}
              </p>
              <p
                className="text-xs text-gray-500 line-clamp-2"
                title={post.description}
              >
                {post.description}
              </p>
              <div className="flex items-center gap-2 text-gray-500 rounded-md p-2 bg-primary/10">
                <div>
                  <p className="text-primary font-semibold text-sm">
                    {formatCurrencyWithUnit(post.price, "tháng")}
                  </p>
                  {post.deposit > 0 && (
                    <p className="text-xs text-gray-500">
                      {t("common.deposit")}:{" "}
                      {formatVietnamCurrency(post.deposit)}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-1.5 text-gray-500">
                <MapPinIcon className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <p className="text-xs line-clamp-2" title={fullAddress}>
                  {fullAddress}
                </p>
              </div>
              {post.phone && (
                <div className="flex items-center gap-1.5 text-gray-500">
                  <PhoneIcon className="w-3.5 h-3.5 shrink-0" />
                  <p className="text-xs">{post.phone}</p>
                </div>
              )}
            </div>
          </div>
          <SheetFooter>
            {post.phone && (
              <a
                href={`tel:${post.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 block"
              >
                <Button variant="outline" className="w-full">
                  <PhoneIcon className="w-4 h-4" />
                  <p>{t("common.call_now")}</p>
                </Button>
              </a>
            )}
            <Link href={`/posts/${post.id}`} className="flex-1 block">
              <Button variant="default" className="w-full">
                <ExternalLinkIcon className="w-4 h-4" />
                <p>{t("common.view_details")}</p>
              </Button>
            </Link>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  }
);
