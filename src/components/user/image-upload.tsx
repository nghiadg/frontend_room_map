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
        "relative overflow-hidden rounded-lg border border-gray-200",
        className
      )}
    >
      <Image
        src={imageUrl}
        alt={alt}
        className="h-full w-full object-cover"
        width={width}
        height={height}
        loading={loading}
      />
      <div className="absolute inset-0 transition-all duration-300 hover:bg-black/30">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className="absolute right-1.5 top-1.5 flex h-6 w-6 cursor-pointer items-center justify-center rounded-md bg-black/50 transition-all duration-300 hover:bg-red-500"
              onClick={onDelete}
            >
              <TrashIcon size={14} color="white" />
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
