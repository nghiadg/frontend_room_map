"use client";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useViewImages } from "@/store/view-images-store";

// Navigation button styling helper
const getNavButtonClassName = (canScroll: boolean) =>
  cn(
    "bg-black/50 rounded-full p-2 transition-opacity",
    canScroll ? "cursor-pointer opacity-100" : "cursor-not-allowed opacity-30"
  );

export default function ViewImages() {
  const { images, currentImage, setCurrentImage, isOpen, onClose } =
    useViewImages();

  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);

  const canScrollPrev = currentImage > 1;
  const canScrollNext = currentImage < images.length;

  const viewImageSrc = useMemo(() => {
    return images[currentImage - 1];
  }, [images, currentImage]);

  const handlePrevious = () => {
    if (currentImage > 1) {
      const newIndex = currentImage - 1;
      setCurrentImage(newIndex);
      carouselApi?.scrollTo(newIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentImage < images.length) {
      const newIndex = currentImage + 1;
      setCurrentImage(newIndex);
      carouselApi?.scrollTo(newIndex - 1);
    }
  };

  const handleImageClick = (idx: number) => {
    carouselApi?.scrollTo(idx);
    setCurrentImage(idx + 1);
  };

  return (
    <>
      {isOpen ? (
        <>
          <div
            className="fixed inset-0 w-screen h-dvh bg-black/70 z-50 pt-14 pb-4 px-4 lg:px-14 pointer-events-auto"
            style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute top-4 right-4 z-50"
              onClick={onClose}
              aria-label="Close image viewer"
            >
              <XIcon className="w-6 h-6 text-white cursor-pointer" />
            </button>
            <div className="flex flex-col h-full gap-4">
              <div className="flex-1 min-h-0 relative">
                {viewImageSrc ? (
                  <Image
                    src={viewImageSrc}
                    alt={`Image ${currentImage} of ${images.length}`}
                    className="object-contain w-full h-full rounded-lg overflow-hidden"
                    fill
                    loading="lazy"
                  />
                ) : null}
              </div>

              <div className=" min-w-full lg:min-w-2xl mx-auto flex items-center gap-2 justify-between">
                <button
                  type="button"
                  disabled={!canScrollPrev}
                  className={getNavButtonClassName(canScrollPrev)}
                  onClick={handlePrevious}
                  aria-label="Previous image"
                  aria-disabled={!canScrollPrev}
                >
                  <ChevronLeftIcon className="w-6 h-6 text-white" />
                </button>
                <Carousel className="flex-1" setApi={setCarouselApi}>
                  <CarouselContent>
                    {images.map((image, idx) => (
                      <CarouselItem
                        key={idx}
                        className="basis-1/3 lg:basis-1/5"
                      >
                        <div
                          className={cn(
                            "relative aspect-square w-full h-full",
                            currentImage === idx + 1
                              ? "border-2 border-white rounded-lg"
                              : ""
                          )}
                          onClick={() => handleImageClick(idx)}
                        >
                          <Image
                            src={image}
                            alt={`Thumbnail ${idx + 1}`}
                            className="object-cover rounded-lg aspect-square"
                            fill
                            loading="lazy"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
                <button
                  type="button"
                  disabled={!canScrollNext}
                  className={getNavButtonClassName(canScrollNext)}
                  onClick={handleNext}
                  aria-label="Next image"
                  aria-disabled={!canScrollNext}
                >
                  <ChevronRightIcon className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
