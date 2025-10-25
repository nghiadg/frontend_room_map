import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { EyeIcon } from "lucide-react";
import Image from "next/image";

export default function ImageGallery() {
  return (
    <div className="mb-4 lg:mb-8 relative">
      {/* Mobile: Simple full-width images */}
      <div className="lg:hidden">
        <div className="relative h-[280px] w-full">
          <Carousel className="w-full h-full">
            <CarouselContent>
              <CarouselItem>
                <div className="h-[280px] w-full rounded-lg overflow-hidden relative">
                  <Image
                    src="https://www.bhg.com/thmb/H9VV9JNnKl-H1faFXnPlQfNprYw=/1799x0/filters:no_upscale():strip_icc()/white-modern-house-curved-patio-archway-c0a4a3b3-aa51b24d14d0464ea15d36e05aa85ac9.jpg"
                    alt="Image 1"
                    className="object-cover"
                    fill
                    priority
                  />
                </div>
              </CarouselItem>
              <CarouselItem>
                <div className="h-[280px] w-full rounded-lg overflow-hidden relative">
                  <Image
                    src="https://www.bhg.com/thmb/H9VV9JNnKl-H1faFXnPlQfNprYw=/1799x0/filters:no_upscale():strip_icc()/white-modern-house-curved-patio-archway-c0a4a3b3-aa51b24d14d0464ea15d36e05aa85ac9.jpg"
                    alt="Image 1"
                    className="object-cover"
                    fill
                    priority
                  />
                </div>
              </CarouselItem>
            </CarouselContent>
          </Carousel>

          {/* Image counter */}
          <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full">
            1 / 5
          </div>
        </div>
      </div>

      {/* Desktop: Grid layout */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-4 gap-2 h-[450px] xl:h-[500px] rounded-xl overflow-hidden">
          {/* Main large image - takes 2 columns */}
          <div className="col-span-2 row-span-2 relative">
            <Image
              src="https://www.bhg.com/thmb/H9VV9JNnKl-H1faFXnPlQfNprYw=/1799x0/filters:no_upscale():strip_icc()/white-modern-house-curved-patio-archway-c0a4a3b3-aa51b24d14d0464ea15d36e05aa85ac9.jpg"
              alt="Image 1"
              fill
              className="object-cover hover:brightness-95 transition-all cursor-pointer"
              priority
            />
          </div>
          {/* Small images grid on the right */}
          {[1, 2, 3, 4, 5].map((img, idx) => (
            <div key={idx} className="col-span-1 relative">
              <Image
                src="https://www.bhg.com/thmb/H9VV9JNnKl-H1faFXnPlQfNprYw=/1799x0/filters:no_upscale():strip_icc()/white-modern-house-curved-patio-archway-c0a4a3b3-aa51b24d14d0464ea15d36e05aa85ac9.jpg"
                alt={`Gallery ${idx + 2}`}
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
        >
          <EyeIcon className="w-4 h-4" />
          Xem tất cả ảnh
        </Button>
      </div>
    </div>
  );
}
