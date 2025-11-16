"use client";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useViewImages } from "@/store/view-images-store";
import { EyeIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

type ImageGalleryProps = {
  images: string[];
};

export default function ImageGallery({ images = [] }: ImageGalleryProps) {
  const { onOpen } = useViewImages();

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
      {/* Mobile: Simple full-width images */}
      <div className="lg:hidden">
        <div className="relative h-[280px] w-full">
          <Carousel className="w-full h-full" setApi={setCarouselApi}>
            <CarouselContent>
              {images.map((image, idx) => (
                <CarouselItem key={idx}>
                  <div
                    className="h-[280px] w-full rounded-lg overflow-hidden relative"
                    onClick={() => handleImageClick(idx)}
                  >
                    <Image
                      src={image}
                      alt={`Image ${idx + 1}`}
                      className="object-cover"
                      fill
                      priority
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Image counter */}
          <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full">
            {currentImage} / {images.length}
          </div>
        </div>
      </div>

      {/* Desktop: Grid layout */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-4 gap-2 h-[450px] xl:h-[500px] rounded-xl overflow-hidden">
          {/* Main large image - takes 2 columns */}
          {primaryImage ? (
            <div
              className="col-span-2 row-span-2 relative"
              onClick={() => handleImageClick(0)}
            >
              <Image
                src={primaryImage}
                alt={`Image ${primaryImage}`}
                fill
                className="object-cover hover:brightness-95 transition-all cursor-pointer"
                priority
              />
            </div>
          ) : null}
          {/* Small images grid on the right */}
          {otherImages.map((image, idx) => (
            <div
              key={image}
              className="col-span-1 relative"
              onClick={() => handleImageClick(idx + 1)}
            >
              <Image
                src={image}
                alt={`Image ${idx + 1}`}
                fill
                className="object-cover hover:brightness-95 transition-all cursor-pointer"
              />
            </div>
          ))}
        </div>
        {/* Show all photos button */}
        <Button
          variant="outline"
          size="sm"
          className="absolute bottom-4 right-4"
          onClick={handleViewAllImages}
        >
          <EyeIcon className="w-4 h-4" />
          Xem tất cả ảnh
        </Button>
      </div>
    </div>
  );
}
