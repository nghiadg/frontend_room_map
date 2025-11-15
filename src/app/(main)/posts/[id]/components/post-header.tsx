import { ChevronLeftIcon, MapPinIcon } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { District, Province, Ward } from "@/types/location";

type PostHeaderProps = {
  title: string;
  province: Province;
  district: District;
  ward: Ward;
};

export default function PostHeader({
  title,
  province,
  district,
  ward,
}: PostHeaderProps) {
  return (
    <>
      <div className="lg:hidden sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-3 px-4 -ml-4 w-[calc(100%+2rem)]">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-3">
            <Link href="/posts" className="p-1">
              <ChevronLeftIcon className="w-5 h-5" />
            </Link>
          </div>
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block mb-6">
        <div className="flex items-center justify-between gap-2 mb-2">
          <h1 className="text-2xl md:text-3xl font-semibold">{title}</h1>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-sm flex-wrap">
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPinIcon className="w-4 h-4 text-primary" />
              <p className="font-medium">
                {ward.name}, {district.name}, {province.name}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
