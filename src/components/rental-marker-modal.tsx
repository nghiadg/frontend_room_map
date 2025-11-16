import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { useTranslations } from "next-intl";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleDollarSign,
  ExternalLinkIcon,
  MapPinIcon,
  PhoneIcon,
} from "lucide-react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useViewImages } from "@/store/view-images-store";

const images = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1460518451285-97b6aa326961?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=400&q=80",
];

export const RentalMarkerModal = NiceModal.create(() => {
  const modal = useModal();
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
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>{t("common.quick_view")}</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-2 px-4">
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
            <p className="font-bold line-clamp-1">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the standard dummy text ever since
              the 1500s, wh
            </p>
            <p className="text-gray-500 line-clamp-2">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the standard dummy text ever since
              the 1500s, wh
            </p>
            <div className="flex items-center gap-2 text-gray-500">
              <CircleDollarSign className="w-4 h-4" />
              <div>
                <p className="text-primary font-bold">0909090909</p>
                <div className="flex items-center gap-2 text-gray-500">
                  <p>{t("common.deposit")}</p>
                  <p className="line-clamp-3">0909090909</p>
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
        </div>
        <SheetFooter>
          <a
            href={`tel:0909090909`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 block"
          >
            <Button variant="outline" className="w-full">
              <PhoneIcon className="w-4 h-4" />
              <p>{t("common.call_now")}</p>
            </Button>
          </a>
          <Button variant="default">
            <ExternalLinkIcon className="w-4 h-4" />
            <p>{t("common.view_details")}</p>
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
});
