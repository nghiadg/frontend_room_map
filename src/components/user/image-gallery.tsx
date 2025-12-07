"use client";

import ImageUpload from "@/components/user/image-upload";
import { ALLOWED_FILE_TYPE, MAX_FILE_SIZE } from "@/constants/file";
import {
  isDuplicateFile,
  isFileSizeValid,
  isFileTypeValid,
} from "@/lib/file-utils";
import { ImageFile } from "@/types/file";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ImagePlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type ImageGalleryProps = {
  images: Array<ImageFile>;
  onImagesChange?: (images: Array<ImageFile>) => void;
  onImageRemove?: (newImages: Array<ImageFile>) => void;
  imageClassName?: string;
  emptyClassName?: string;
};

export default function ImageGallery({
  images,
  onImagesChange,
  onImageRemove,
  imageClassName = "",
  emptyClassName = "",
}: ImageGalleryProps) {
  const t = useTranslations();
  const inputRef = useRef<HTMLInputElement>(null);

  const isEmpty = useMemo(() => images.length === 0, [images]);

  const handleAddImage = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = [...(event.target.files ?? [])];
    // clear input value
    event.target.value = "";
    if (!files || files.length === 0) return;
    if (
      isDuplicateFile(
        files,
        images.map((image) => image.file)
      )
    ) {
      toast.error(t("file.image.duplicate"));
      return;
    }
    if (!isFileTypeValid(files, ALLOWED_FILE_TYPE.IMAGE)) {
      toast.error(t("file.image.type_invalid"));
      return;
    }
    if (!isFileSizeValid(files, MAX_FILE_SIZE)) {
      toast.error(t("file.image.max_size_description"));
      return;
    }

    // clear all object URL before create new images
    images.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    // create new images
    const newImages = Array.from(files).map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      id: file.name,
      alt: file.name,
    }));

    onImagesChange?.([...images, ...newImages]);
  };

  const handleImageRemove = (imageId: string) => {
    const deletedImage = images.find((image) => image.id === imageId);
    if (!deletedImage) return;
    URL.revokeObjectURL(deletedImage.previewUrl);
    onImageRemove?.(images.filter((image) => image.id !== imageId));
    toast.success(t("file.image.remove_success"));
  };

  useEffect(() => {
    return () => {
      images.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    };
  }, [images]);

  return (
    <div className="flex flex-col gap-2">
      {isEmpty ? (
        <div
          className={cn(
            "flex flex-col gap-2 items-center justify-center h-full border border-gray-200 rounded-md p-4 text-center text-gray-500",
            emptyClassName
          )}
        >
          <ImagePlusIcon className="w-10 h-10 text-gray-200" />
          <p className="text-sm text-gray-400">{t("file.image.empty")}</p>
          <p className="text-sm text-gray-400">
            {t("file.image.empty_description")}
          </p>
        </div>
      ) : (
        <ul className="flex flex-wrap gap-1">
          {images.map((image) => (
            <li key={image.id}>
              <ImageUpload
                imageUrl={image.previewUrl}
                alt={image.alt || ""}
                width={64}
                height={64}
                loading="lazy"
                onDelete={() => handleImageRemove(image.id)}
                className={imageClassName}
              />
            </li>
          ))}
        </ul>
      )}
      <Button
        size="sm"
        className="w-full"
        type="button"
        onClick={handleAddImage}
      >
        {t("common.add_image")}
      </Button>
      <input
        type="file"
        className="hidden"
        ref={inputRef}
        multiple
        accept={ALLOWED_FILE_TYPE.IMAGE.join(",")}
        onChange={handleFileChange}
      />
    </div>
  );
}
