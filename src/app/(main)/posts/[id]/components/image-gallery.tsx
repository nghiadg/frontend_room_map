"use client";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useViewImages } from "@/store/view-images-store";
import { ChevronLeftIcon, ChevronRightIcon, EyeIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";

type ImageGalleryProps = {
  images: string[];
};

export default function ImageGallery({ images = [] }: ImageGalleryProps) {
  const { onOpen } = useViewImages();
  const t = useTranslations();

  const primaryImage = images[0];
  const otherImages = images.slice(1);

  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [currentImage, setCurrentImage] = useState<number>(0);

  useEffect(() => {
    if (!carouselApi) return;
    const handleSlideChange = () => {
      setCurrentImage(carouselApi.selectedScrollSnap() + 1);
    };

    handleSlideChange();
    carouselApi.on("select", handleSlideChange);
    return () => {
      carouselApi.off("select", handleSlideChange);
    };
  }, [carouselApi]);

  const handleViewAllImages = () => {
    onOpen(images, 1);
  };

  const handleImageClick = (idx: number) => {
    onOpen(images, idx + 1);
  };

  return (
    <div className="mb-4 lg:mb-8 relative">
      {/* Mobile: Simple full-width images with navigation */}
      <div className="lg:hidden">
        <div className="relative h-gallery-mobile w-full">
          <Carousel className="w-full h-full" setApi={setCarouselApi}>
            <CarouselContent>
              {images.map((image, idx) => (
                <CarouselItem key={idx}>
                  <div
                    className="h-gallery-mobile w-full rounded-lg overflow-hidden relative"
                    onClick={() => handleImageClick(idx)}
                  >
                    <Image
                      src={image}
                      alt={t("posts.details.image_alt", {
                        index: idx + 1,
                        total: images.length,
                      })}
                      className="object-cover"
                      fill
                      priority={idx === 0}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Prev/Next buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => carouselApi?.scrollPrev()}
                disabled={currentImage === 1}
                className={`absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center transition-all ${
                  currentImage === 1
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:bg-black/70"
                }`}
                aria-label="Previous image"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => carouselApi?.scrollNext()}
                disabled={currentImage === images.length}
                className={`absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center transition-all ${
                  currentImage === images.length
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:bg-black/70"
                }`}
                aria-label="Next image"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Image counter */}
          <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full">
            {currentImage} / {images.length}
          </div>
        </div>
      </div>

      {/* Desktop: Adaptive Grid layout based on image count */}
      <div className="hidden lg:block">
        {/* Single image layout */}
        {images.length === 1 && (
          <div
            className="relative h-gallery-desktop xl:h-gallery-xl rounded-xl overflow-hidden cursor-pointer"
            onClick={() => handleImageClick(0)}
          >
            <Image
              src={primaryImage}
              alt={t("posts.details.image_alt", {
                index: 1,
                total: images.length,
              })}
              fill
              className="object-cover hover:brightness-95 hover:scale-[1.01] transition-all duration-300"
              priority
            />
          </div>
        )}

        {/* Two images layout - 50/50 split */}
        {images.length === 2 && (
          <div className="grid grid-cols-2 gap-2 h-gallery-desktop xl:h-gallery-xl rounded-xl overflow-hidden">
            <div
              className="relative rounded-l-xl overflow-hidden cursor-pointer"
              onClick={() => handleImageClick(0)}
            >
              <Image
                src={primaryImage}
                alt={t("posts.details.image_alt", {
                  index: 1,
                  total: images.length,
                })}
                fill
                className="object-cover hover:brightness-95 hover:scale-[1.02] transition-all duration-300"
                priority
              />
            </div>
            <div
              className="relative rounded-r-xl overflow-hidden cursor-pointer"
              onClick={() => handleImageClick(1)}
            >
              <Image
                src={otherImages[0]}
                alt={t("posts.details.image_alt", {
                  index: 2,
                  total: images.length,
                })}
                fill
                className="object-cover hover:brightness-95 hover:scale-[1.02] transition-all duration-300"
                loading="lazy"
              />
            </div>
          </div>
        )}

        {/* Three images layout - main + 2 stacked */}
        {images.length === 3 && (
          <div className="grid grid-cols-3 gap-2 h-gallery-desktop xl:h-gallery-xl rounded-xl overflow-hidden">
            <div
              className="col-span-2 relative rounded-l-xl overflow-hidden cursor-pointer"
              onClick={() => handleImageClick(0)}
            >
              <Image
                src={primaryImage}
                alt={t("posts.details.image_alt", {
                  index: 1,
                  total: images.length,
                })}
                fill
                className="object-cover hover:brightness-95 hover:scale-[1.02] transition-all duration-300"
                priority
              />
            </div>
            <div className="flex flex-col gap-2">
              {otherImages.slice(0, 2).map((image, idx) => (
                <div
                  key={idx}
                  className={`relative flex-1 overflow-hidden cursor-pointer ${idx === 0 ? "rounded-tr-xl" : "rounded-br-xl"}`}
                  onClick={() => handleImageClick(idx + 1)}
                >
                  <Image
                    src={image}
                    alt={t("posts.details.image_alt", {
                      index: idx + 2,
                      total: images.length,
                    })}
                    fill
                    className="object-cover hover:brightness-95 hover:scale-[1.02] transition-all duration-300"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Four or more images - Airbnb-style grid */}
        {images.length >= 4 && (
          <div className="grid grid-cols-4 grid-rows-2 gap-2 h-gallery-desktop xl:h-gallery-xl rounded-xl overflow-hidden">
            {/* Main large image - takes left half (2 columns, 2 rows) */}
            <div
              className="col-span-2 row-span-2 relative rounded-l-xl overflow-hidden cursor-pointer"
              onClick={() => handleImageClick(0)}
            >
              <Image
                src={primaryImage}
                alt={t("posts.details.image_alt", {
                  index: 1,
                  total: images.length,
                })}
                fill
                className="object-cover hover:brightness-95 hover:scale-[1.02] transition-all duration-300"
                priority
              />
            </div>

            {/* Secondary images - right side 2x2 grid (max 4 images) */}
            {otherImages.slice(0, 4).map((image, idx) => {
              const isLastVisible = idx === 3;
              const remainingCount = images.length - 5;
              const showOverlay = isLastVisible && remainingCount > 0;

              // Determine corner rounding based on position
              const isTopRight = idx === 1;
              const isBottomRight = idx === 3;

              return (
                <div
                  key={idx}
                  className={`relative overflow-hidden cursor-pointer ${isTopRight ? "rounded-tr-xl" : ""} ${isBottomRight ? "rounded-br-xl" : ""}`}
                  onClick={() => handleImageClick(idx + 1)}
                >
                  <Image
                    src={image}
                    alt={t("posts.details.image_alt", {
                      index: idx + 2,
                      total: images.length,
                    })}
                    fill
                    className="object-cover hover:brightness-95 hover:scale-[1.02] transition-all duration-300"
                    loading="lazy"
                  />
                  {/* Overlay showing remaining photos count */}
                  {showOverlay && (
                    <div
                      className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer hover:bg-black/40 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewAllImages();
                      }}
                    >
                      <span className="text-white text-2xl font-semibold">
                        +{remainingCount} {t("posts.details.photos")}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Show all photos button */}
        <Button
          variant="outline"
          size="sm"
          className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white shadow-md"
          onClick={handleViewAllImages}
        >
          <EyeIcon className="w-4 h-4" />
          {t("posts.details.view_all_photos")}
        </Button>
      </div>
    </div>
  );
}
