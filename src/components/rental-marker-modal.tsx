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

type RentalMarkerModalProps = {
  post: PostMapMarker;
};

export const RentalMarkerModal = NiceModal.create<RentalMarkerModalProps>(
  ({ post }) => {
    const modal = useModal();
    const t = useTranslations();
    const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
    const [currentImage, setCurrentImage] = useState<number>(0);
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
      const handleSlideChange = () => {
        setCurrentImage(carouselApi?.selectedScrollSnap() + 1);
      };
      handleSlideChange();
      carouselApi.on("select", handleSlideChange);
      return () => {
        carouselApi.off("select", handleSlideChange);
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
            <div className="overflow-hidden rounded-md relative aspect-3/2">
              <button
                type="button"
                onClick={handlePrevious}
                className="absolute top-1/2 left-1 -translate-y-1/2 text-white bg-black/50 rounded-full p-2 z-10 cursor-pointer"
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute top-1/2 right-1 -translate-y-1/2 text-white bg-black/50 rounded-full p-2 z-10 cursor-pointer"
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
              <div>
                <div className="absolute bottom-1 right-1 text-white bg-black/50 rounded-full px-2 z-10 cursor-pointer">
                  {currentImage} / {images.length}
                </div>
              </div>
              <Carousel setApi={setCarouselApi}>
                <CarouselContent>
                  {images.map((image, idx) => (
                    <CarouselItem key={idx} onClick={handleViewAllImages}>
                      <Image
                        src={image}
                        alt="Rental Marker"
                        width={150}
                        height={150}
                        className="object-cover w-full h-full"
                        loading="lazy"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>

            <div className="flex flex-col gap-2">
              <p className="font-bold line-clamp-1" title={post.title}>
                {post.title}
              </p>
              <p
                className="text-gray-500 line-clamp-2"
                title={post.description}
              >
                {post.description}
              </p>
              <div className="flex items-center gap-2 text-gray-500 rounded-md p-2 bg-primary/10">
                <div>
                  <p className="text-primary font-bold text-lg">
                    {formatCurrencyWithUnit(post.price, "tháng")}
                  </p>
                  {post.deposit > 0 && (
                    <div className="flex items-center gap-2 text-gray-500">
                      <p>{t("common.deposit")}</p>
                      <p className="line-clamp-3">
                        {formatVietnamCurrency(post.deposit)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <MapPinIcon className="w-4 h-4" />
                <p className="line-clamp-3" title={fullAddress}>
                  {fullAddress}
                </p>
              </div>
              {post.phone && (
                <div className="flex items-center gap-2 text-gray-500">
                  <PhoneIcon className="w-4 h-4" />
                  <p className="line-clamp-3">{post.phone}</p>
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
