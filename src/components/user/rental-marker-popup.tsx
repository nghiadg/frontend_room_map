import { useViewImages } from "@/store/view-images-store";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
  HomeIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
  XIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { PostMapMarker } from "@/services/client/posts";
import {
  formatVietnamCurrency,
  formatCurrencyWithUnit,
  formatFullAddress,
} from "@/lib/utils/currency";
import { formatRelativeDate } from "@/lib/utils/date";
import { PostInfoRow } from "./post-info-row";
import { getPropertyTypeLabelKey } from "@/lib/utils/property-type-icons";
import { SourceBadge } from "./source-badge";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80";

type RentalMarkerPopupProps = {
  post: PostMapMarker;
  onClose: () => void;
};

export default function RentalMarkerPopup({
  post,
  onClose,
}: RentalMarkerPopupProps) {
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

  const handleViewAllImages = () => {
    onOpenViewImages(images, currentImage);
  };

  return (
    <div className="w-72 bg-white rounded-md shadow-sm p-4 relative">
      <button
        type="button"
        onClick={onClose}
        className="rounded-full p-1 bg-white border border-gray-200 cursor-pointer absolute -top-2 -right-2 z-50 hover:bg-gray-100 transition-all duration-300"
        aria-label={t("common.close")}
      >
        <XIcon className="w-4 h-4 text-black" aria-hidden="true" />
      </button>
      <div className="flex flex-col gap-3">
        <div className="overflow-hidden rounded-md relative">
          <button
            type="button"
            onClick={handlePrevious}
            className="absolute top-1/2 left-1 -translate-y-1/2 text-white bg-black/50 rounded-full p-2 z-10 cursor-pointer"
            aria-label={t("common.previous")}
          >
            <ChevronLeftIcon className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="absolute top-1/2 right-1 -translate-y-1/2 text-white bg-black/50 rounded-full p-2 z-10 cursor-pointer"
            aria-label={t("common.next")}
          >
            <ChevronRightIcon className="w-4 h-4" aria-hidden="true" />
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
                  <div className="relative w-full aspect-4/3 bg-gray-100 rounded-md overflow-hidden">
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

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <p
              className="text-base font-bold line-clamp-1 flex-1"
              title={post.title}
            >
              {post.title}
            </p>
            <SourceBadge source={post.source} size="sm" />
          </div>
          <p
            className="text-sm text-gray-500 line-clamp-2"
            title={post.description}
          >
            {post.description}
          </p>
          <div className="flex items-center gap-2 text-gray-500 rounded-md p-2 bg-primary/10">
            <div>
              <p className="text-primary font-bold text-sm">
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
          <PostInfoRow icon={HomeIcon} className="text-gray-500">
            <span>{t(getPropertyTypeLabelKey(post.propertyTypeKey))}</span>
          </PostInfoRow>
          <PostInfoRow icon={MapPinIcon} className="text-gray-500">
            <span className="line-clamp-2" title={fullAddress}>
              {fullAddress}
            </span>
          </PostInfoRow>
          {post.posterName && (
            <PostInfoRow icon={UserIcon} className="text-gray-500">
              <span className="line-clamp-1">{post.posterName}</span>
            </PostInfoRow>
          )}
          {post.phone && (
            <PostInfoRow icon={PhoneIcon} className="text-gray-500">
              {post.phone}
            </PostInfoRow>
          )}
          {post.createdAt && (
            <PostInfoRow icon={CalendarIcon} className="text-gray-500">
              {formatRelativeDate(post.createdAt)}
            </PostInfoRow>
          )}
        </div>

        <div className="flex items-center gap-2 mt-2">
          {post.phone && (
            <a
              href={`tel:${post.phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 block"
            >
              <Button variant="outline" size="sm" className="w-full">
                <PhoneIcon className="w-4 h-4" aria-hidden="true" />
                <span>{t("common.call_now")}</span>
              </Button>
            </a>
          )}
          <Link href={`/posts/${post.id}`} className="flex-1 block">
            <Button size="sm" className="w-full">
              <ExternalLinkIcon className="w-4 h-4" aria-hidden="true" />
              <span>{t("common.view_details")}</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
