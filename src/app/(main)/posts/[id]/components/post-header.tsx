import { ChevronLeftIcon, MapPinIcon } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function PostHeader() {
  return (
    <>
      <div className="lg:hidden sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-3 px-4 -ml-4 w-[calc(100%+2rem)]">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-3">
            <Link href="/posts" className="p-1">
              <ChevronLeftIcon className="w-5 h-5" />
            </Link>
          </div>
          <h1 className="text-lg font-semibold">
            Nhà ở cho thuê Nhà ở cho thuê Nhà ở cho thuê Nhà ở cho thuê
            <Badge className="ml-2">Còn phòng</Badge>
          </h1>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block mb-6">
        <div className="flex items-center justify-between gap-2 mb-2">
          <h1 className="text-2xl md:text-3xl font-semibold">
            Nhà ở cho thuê Nhà ở cho thuê Nhà ở cho thuê Nhà ở cho thuê
          </h1>
          <Badge>Còn phòng</Badge>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-sm flex-wrap">
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPinIcon className="w-4 h-4 text-primary" />
              <p className="font-medium">Quận 1, Thành phố Hồ Chí Minh</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
