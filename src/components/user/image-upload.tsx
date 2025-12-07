import Image from "next/image";
import { TrashIcon } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type ImageUploadProps = {
  onDelete?: () => void;
  imageUrl: string;
  alt: string;
  width: number;
  height: number;
  loading: "lazy" | "eager";
  className?: string;
};

export default function ImageUpload({
  onDelete,
  imageUrl,
  alt,
  width,
  height,
  loading = "lazy",
  className = "",
}: ImageUploadProps) {
  const t = useTranslations();
  return (
    <div
      className={cn(
        "w-[64px] h-[64px] rounded-sm overflow-hidden border border-gray-200 relative",
        className
      )}
    >
      <Image
        src={imageUrl}
        alt={alt}
        className="w-full h-full object-cover"
        width={width}
        height={height}
        loading={loading}
      />
      <div className="absolute inset-0 hover:bg-black/30 transition-all duration-300">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className="absolute top-1 right-1 bg-black/50 rounded-xs w-4 h-4 flex items-center justify-center cursor-pointer hover:bg-black/70 transition-all duration-300"
              onClick={onDelete}
            >
              <TrashIcon size={10} color="white" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("common.delete")}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
