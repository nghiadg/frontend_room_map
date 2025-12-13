"use client";

import { cn } from "@/lib/utils";
import { List } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import MapPostsListPanel from "./map-posts-list-panel";
import { useState, useCallback, useMemo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslations } from "next-intl";
import { PostMapMarker } from "@/services/client/posts";

/** Maximum count displayed in badge before showing "99+" */
const MAX_BADGE_COUNT = 99;

type MapPostsListButtonProps = {
  posts: PostMapMarker[];
  onPostClick: (post: PostMapMarker) => void;
  className?: string;
};

/**
 * Button that opens a popover/sheet with list of visible posts
 * Always closed by default - user clicks to open
 */
export default function MapPostsListButton({
  posts,
  onPostClick,
  className,
}: MapPostsListButtonProps) {
  // Always start closed
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const t = useTranslations("map.posts_list");

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handlePostClick = useCallback(
    (post: PostMapMarker) => {
      onPostClick(post);
      // Keep panel open after clicking - user might want to click multiple
    },
    [onPostClick]
  );

  const ListButton = useMemo(
    () => (
      <Button
        size="sm"
        className={cn(
          "rounded-full shadow-lg transition-all duration-200 relative",
          isOpen && "bg-primary ring-2 ring-primary/50"
        )}
        aria-label={t("button.aria_label", { count: posts.length })}
      >
        <List className="h-4 w-4 mr-1.5" />
        {t("button.label")}
        {posts.length > 0 && (
          <span
            className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-bold animate-in zoom-in-50"
            aria-label={t("button.count", { count: posts.length })}
          >
            {posts.length > MAX_BADGE_COUNT ? MAX_BADGE_COUNT : posts.length}
          </span>
        )}
      </Button>
    ),
    [isOpen, posts.length, t]
  );

  const panelProps = {
    posts,
    onPostClick: handlePostClick,
    onClose: handleClose,
  };

  return (
    <div className={cn("fixed bottom-6 left-6 z-10", className)}>
      {isMobile ? (
        // Mobile: Bottom Sheet
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>{ListButton}</SheetTrigger>
          <SheetContent
            side="bottom"
            className="p-0 [&>button]:hidden"
            aria-describedby="posts-list-sheet-description"
          >
            <span id="posts-list-sheet-description" className="sr-only">
              {t("description")}
            </span>
            <MapPostsListPanel {...panelProps} />
          </SheetContent>
        </Sheet>
      ) : (
        // Desktop: Popover
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>{ListButton}</PopoverTrigger>
          <PopoverContent
            side="top"
            align="start"
            className="w-80 p-0 shadow-xl"
            sideOffset={10}
            aria-describedby="posts-list-popover-description"
          >
            <span id="posts-list-popover-description" className="sr-only">
              {t("description")}
            </span>
            <MapPostsListPanel {...panelProps} />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
