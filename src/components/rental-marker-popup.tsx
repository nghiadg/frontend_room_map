import { useViewImages } from "@/store/view-images-store";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
  MapPinIcon,
  PhoneIcon,
  XIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "./ui/carousel";

const images = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1460518451285-97b6aa326961?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=400&q=80",
];

type RentalMarkerPopupProps = {
  onClose: () => void;
};

export default function RentalMarkerPopup({ onClose }: RentalMarkerPopupProps) {
  const t = useTranslations();
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [currentImage, setCurrentImage] = useState<number>(0);
  const { onOpen: onOpenViewImages } = useViewImages();

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
      >
        <XIcon className="w-4 h-4 text-black" />
      </button>
      <div className="flex flex-col gap-2">
        <div className="overflow-hidden rounded-md relative">
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
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-sm font-bold line-clamp-1">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the standard dummy text ever since
            the 1500s, wh
          </p>
          <p className="text-sm text-gray-500 line-clamp-2">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the standard dummy text ever since
            the 1500s, wh
          </p>
          <div className="flex items-center gap-2 text-gray-500 rounded-md p-2 bg-primary/10">
            <div>
              <p className="text-primary font-bold text-sm">3,000,000đ/tháng</p>
              <div className="flex items-center gap-2 text-gray-500">
                <p>{t("common.deposit")}</p>
                <p className="line-clamp-3">300,000đ</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <MapPinIcon className="w-4 h-4" />
            <p className="line-clamp-3">123 Đường ABC, Quận XYZ, TP. HCM</p>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <PhoneIcon className="w-4 h-4" />
            <p className="line-clamp-3">0909090909</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <a
            href={`tel:0909090909`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 block"
          >
            <Button variant="outline" size="sm" className="w-full">
              <PhoneIcon className="w-4 h-4" />
              <p>{t("common.call_now")}</p>
            </Button>
          </a>
          <Button variant="outline" size="sm" className="flex-1">
            <ExternalLinkIcon className="w-4 h-4" />
            <p>{t("common.view_details")}</p>
          </Button>
        </div>
      </div>
    </div>
  );
}
