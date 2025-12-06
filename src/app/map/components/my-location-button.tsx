"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Locate, LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";

type MyLocationButtonProps = {
  /** Called when the locate button is clicked */
  onLocate: () => void;
  /** Optional: external loading state from parent */
  isLocating?: boolean;
  className?: string;
};

export default function MyLocationButton({
  onLocate,
  isLocating = false,
  className,
}: MyLocationButtonProps) {
  const t = useTranslations("map");

  return (
    <Button
      variant="secondary"
      size="icon"
      className={cn(
        "rounded-full shadow-lg transition-all duration-200 h-12 w-12",
        "bg-background/95 backdrop-blur-sm hover:bg-background",
        "border border-border/50",
        isLocating && "animate-pulse",
        className
      )}
      onClick={onLocate}
      disabled={isLocating}
      aria-label={t("location.button_label")}
    >
      {isLocating ? (
        <LoaderCircle className="h-5 w-5 animate-spin text-primary" />
      ) : (
        <Locate className="h-5 w-5" />
      )}
    </Button>
  );
}
