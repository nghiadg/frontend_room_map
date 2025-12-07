"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function Description({ description }: { description: string }) {
  const [viewMore, setViewMore] = useState(false);
  const t = useTranslations();
  const handleViewMore = () => {
    setViewMore(!viewMore);
  };

  return (
    <div className="py-6 lg:py-8 border-b">
      <h2 className="text-xl md:text-2xl font-semibold mb-6">
        {t("posts.details.description")}
      </h2>
      <div className="flex flex-col gap-2">
        <p
          className={cn(
            "text-base leading-relaxed whitespace-pre-line line-clamp-3",
            viewMore && "line-clamp-none"
          )}
        >
          {description}
        </p>
        <Button variant="link" size="sm" onClick={handleViewMore}>
          {viewMore ? t("common.view_less") : t("common.view_more")}
        </Button>
      </div>
    </div>
  );
}
