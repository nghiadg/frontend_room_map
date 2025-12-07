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
import { useCallback, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { CloudUploadIcon, PlusIcon } from "lucide-react";

type ImageGalleryProps = {
  images: Array<ImageFile>;
  onImagesChange?: (images: Array<ImageFile>) => void;
  onImageRemove?: (newImages: Array<ImageFile>) => void;
  imageClassName?: string;
  emptyClassName?: string;
  maxImages?: number;
};

export default function ImageGallery({
  images,
  onImagesChange,
  onImageRemove,
  imageClassName = "",
  emptyClassName = "",
  maxImages = 10,
}: ImageGalleryProps) {
  const t = useTranslations();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const isEmpty = useMemo(() => images.length === 0, [images]);
  const canAddMore = images.length < maxImages;

  const handleAddImage = () => {
    inputRef.current?.click();
  };

  const processFiles = useCallback(
    (files: File[]) => {
      if (!files || files.length === 0) return;

      // Check if adding these files would exceed the limit
      if (images.length + files.length > maxImages) {
        toast.error(t("file.image.max_count", { count: maxImages }));
        return;
      }

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

      // Create new images
      const newImages = Array.from(files).map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
        id: `${file.name}-${Date.now()}`,
        alt: file.name,
      }));

      onImagesChange?.([...images, ...newImages]);
    },
    [images, maxImages, onImagesChange, t]
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = [...(event.target.files ?? [])];
    event.target.value = "";
    processFiles(files);
  };

  const handleImageRemove = (imageId: string) => {
    const deletedImage = images.find((image) => image.id === imageId);
    if (!deletedImage) return;
    if (!deletedImage.isUploaded) {
      URL.revokeObjectURL(deletedImage.previewUrl);
    }
    onImageRemove?.(images.filter((image) => image.id !== imageId));
    toast.success(t("file.image.remove_success"));
  };

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      processFiles(files);
    },
    [processFiles]
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Dropzone Area */}
      <div
        onClick={isEmpty ? handleAddImage : undefined}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative rounded-xl border-2 border-dashed transition-all duration-200",
          isEmpty && "cursor-pointer",
          isDragging
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-gray-200 hover:border-gray-300",
          emptyClassName
        )}
      >
        {isEmpty ? (
          // Empty State - Modern Dropzone
          <div className="flex flex-col items-center justify-center py-12 px-6">
            <div
              className={cn(
                "mb-4 rounded-full p-4 transition-all duration-200",
                isDragging ? "bg-primary/10" : "bg-gray-50"
              )}
            >
              <CloudUploadIcon
                className={cn(
                  "h-10 w-10 transition-colors duration-200",
                  isDragging ? "text-primary" : "text-gray-400"
                )}
              />
            </div>
            <h3 className="mb-1 text-base font-semibold text-gray-700">
              {t("file.image.dropzone_title")}
            </h3>
            <p className="mb-3 text-sm text-gray-500">
              {t("file.image.dropzone_subtitle")}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-gray-400">
              <span className="rounded-full bg-gray-100 px-2.5 py-1">JPG</span>
              <span className="rounded-full bg-gray-100 px-2.5 py-1">PNG</span>
              <span className="rounded-full bg-gray-100 px-2.5 py-1">WEBP</span>
              <span className="text-gray-300">•</span>
              <span>{t("file.image.max_size")}</span>
            </div>
          </div>
        ) : (
          // Image Grid with Add More Button
          <div className="p-4">
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
              {images.map((image) => (
                <ImageUpload
                  key={image.id}
                  imageUrl={image.previewUrl}
                  alt={image.alt || ""}
                  width={128}
                  height={128}
                  loading="lazy"
                  onDelete={() => handleImageRemove(image.id)}
                  className={cn(
                    "aspect-square w-full rounded-lg",
                    imageClassName
                  )}
                />
              ))}

              {/* Add More Button - Inline with images */}
              {canAddMore && (
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="group flex aspect-square w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 transition-all hover:border-primary hover:bg-primary/5"
                >
                  <div className="flex flex-col items-center gap-1">
                    <PlusIcon className="h-6 w-6 text-gray-400 transition-colors group-hover:text-primary" />
                    <span className="text-xs text-gray-400 transition-colors group-hover:text-primary">
                      {t("common.add")}
                    </span>
                  </div>
                </button>
              )}
            </div>

            {/* Image count indicator */}
            <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
              <span>
                {images.length}/{maxImages} {t("file.image.uploaded")}
              </span>
              {isDragging && (
                <span className="text-primary font-medium">
                  {t("file.image.drop_here")}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Hidden file input */}
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
