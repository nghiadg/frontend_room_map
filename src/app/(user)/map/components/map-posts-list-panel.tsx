"use client";

import { PostMapMarker } from "@/services/client/posts";
import { formatVietnamCurrency } from "@/lib/utils/currency";
import { getPropertyTypeIconPath } from "@/lib/utils/property-type-icons";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type MapPostsListPanelProps = {
  posts: PostMapMarker[];
  onPostClick: (post: PostMapMarker) => void;
  onClose: () => void;
};

/**
 * Panel component displaying list of posts visible on map
 * Allows users to browse and click to fly to marker location
 */
export default function MapPostsListPanel({
  posts,
  onPostClick,
  onClose,
}: MapPostsListPanelProps) {
  const t = useTranslations("map.posts_list");

  return (
    <div className="flex flex-col h-full max-h-[50vh]">
      {/* Header - compact like filter panel */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold text-base">
          {t("title")} ({posts.length})
        </h3>
        <button
          onClick={onClose}
          className="p-1 rounded-md hover:bg-accent transition-colors"
          aria-label={t("close")}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Posts list - scrollable */}
      <div className="flex-1 overflow-y-auto px-2 py-1 max-h-[calc(50vh-3rem)]">
        {posts.length === 0 ? (
          <div className="p-3 text-center text-muted-foreground text-sm">
            {t("empty")}
          </div>
        ) : (
          <div className="space-y-1">
            {posts.map((post) => (
              <PostListItem
                key={post.id}
                post={post}
                onClick={() => onPostClick(post)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

type PostListItemProps = {
  post: PostMapMarker;
  onClick: () => void;
};

function PostListItem({ post, onClick }: PostListItemProps) {
  const iconPath = getPropertyTypeIconPath(post.propertyTypeKey);
  const hasImage = post.images && post.images.length > 0;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-2 p-1.5 rounded-md",
        "hover:bg-accent/50 transition-colors duration-150",
        "text-left focus:outline-none focus:bg-accent/70"
      )}
    >
      {/* Thumbnail or property type icon - smaller */}
      <div className="relative w-10 h-10 rounded-md overflow-hidden bg-muted flex-shrink-0">
        {hasImage ? (
          <Image
            src={post.images[0]}
            alt={post.title}
            fill
            className="object-cover"
            sizes="40px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Image
              src={iconPath}
              alt=""
              width={20}
              height={20}
              className="rounded-full"
              aria-hidden="true"
            />
          </div>
        )}
      </div>

      {/* Post info - compact with full address */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm line-clamp-1">{post.title}</p>
        <p className="text-primary font-semibold text-xs">
          {formatVietnamCurrency(post.price)}/tháng
        </p>
        <p className="text-muted-foreground text-xs line-clamp-1">
          {post.address}, {post.wardName}, {post.districtName},{" "}
          {post.provinceName}
        </p>
      </div>
    </button>
  );
}
