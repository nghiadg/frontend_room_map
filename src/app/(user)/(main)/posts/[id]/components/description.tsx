"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

export default function Description({ description }: { description: string }) {
  const [viewMore, setViewMore] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);
  const t = useTranslations();

  // Check if text is actually truncated
  useEffect(() => {
    const checkTruncation = () => {
      if (textRef.current) {
        // Compare scrollHeight (full content) vs clientHeight (visible area)
        setIsTruncated(
          textRef.current.scrollHeight > textRef.current.clientHeight
        );
      }
    };

    checkTruncation();

    // Re-check on window resize
    window.addEventListener("resize", checkTruncation);
    return () => window.removeEventListener("resize", checkTruncation);
  }, [description]);

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
          ref={textRef}
          className={cn(
            "text-base leading-relaxed whitespace-pre-line",
            !viewMore && "line-clamp-3"
          )}
        >
          {description}
        </p>
        {(isTruncated || viewMore) && (
          <Button variant="link" size="sm" onClick={handleViewMore}>
            {viewMore ? t("common.view_less") : t("common.view_more")}
          </Button>
        )}
      </div>
    </div>
  );
}
