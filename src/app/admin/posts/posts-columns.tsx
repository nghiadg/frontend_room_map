"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { SortableHeader } from "@/components/ui/sortable-header";
import { useTranslations } from "next-intl";
import { formatDate } from "@/lib/utils/date";
import { formatVietnamCurrency } from "@/lib/utils/currency";
import { getImageUrl } from "@/lib/s3/image-url";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { POST_STATUS } from "@/constants/post-status";
import { PostSource } from "@/constants/post-source";
import { SourceBadge } from "@/components/user/source-badge";
import { PostActionsCell } from "./components/post-actions-cell";

export type Post = {
  id: number;
  title: string;
  address: string;
  wardName: string | null;
  districtName: string | null;
  provinceName: string | null;
  price: number;
  area: number;
  propertyTypeKey: string;
  propertyTypeName: string;
  status: string;
  source: PostSource;
  createdAt: string;
  creatorId: number;
  creatorName: string;
  creatorEmail: string | null;
  firstImageUrl: string | null;
  imageCount: number;
};

type StatusVariant = "default" | "secondary" | "destructive" | "outline";

const getStatusVariant = (status: string): StatusVariant => {
  switch (status) {
    case POST_STATUS.DELETED:
      return "destructive";
    case POST_STATUS.RENTED:
      return "secondary";
    case POST_STATUS.HIDDEN:
      return "outline";
    case POST_STATUS.EXPIRED:
      return "outline";
    default:
      return "default";
  }
};

const getStatusKey = (status: string): string => {
  switch (status) {
    case POST_STATUS.DELETED:
      return "deleted";
    case POST_STATUS.RENTED:
      return "rented";
    case POST_STATUS.HIDDEN:
      return "hidden";
    case POST_STATUS.EXPIRED:
      return "expired";
    default:
      return "available";
  }
};

/**
 * Build full address from components
 */
const buildFullAddress = (post: Post): string => {
  const parts = [
    post.address,
    post.wardName,
    post.districtName,
    post.provinceName,
  ].filter((part) => part && part.trim() !== "");
  return parts.join(", ");
};

/**
 * Hook to get posts table columns with i18n support
 */
export function usePostsColumns(): ColumnDef<Post>[] {
  const t = useTranslations();

  return [
    {
      accessorKey: "firstImageUrl",
      header: t("admin.posts.columns.image"),
      cell: ({ row }) => {
        const imageKey = row.original.firstImageUrl;
        const imageCount = row.original.imageCount;
        const hasValidImage = imageKey && imageKey.trim() !== "";
        const imageUrl = hasValidImage ? getImageUrl(imageKey) : null;

        return (
          <div className="relative h-12 w-16 overflow-hidden rounded-md bg-muted">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={row.original.title}
                fill
                className="object-cover"
                sizes="64px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                —
              </div>
            )}
            {imageCount > 0 && (
              <div className="absolute bottom-0.5 right-0.5 bg-black/70 text-white text-[10px] px-1 rounded flex items-center gap-0.5">
                <ImageIcon className="h-2.5 w-2.5" />
                {imageCount}
              </div>
            )}
          </div>
        );
      },
      size: 80,
      minSize: 80,
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <SortableHeader column={column} titleKey="admin.posts.columns.title" />
      ),
      cell: ({ row }) => {
        const post = row.original;
        const fullAddress = buildFullAddress(post);
        return (
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-medium line-clamp-1">{post.title}</span>
              <SourceBadge source={post.source} size="sm" />
            </div>
            <span className="text-xs text-muted-foreground line-clamp-1">
              {fullAddress}
            </span>
          </div>
        );
      },
      size: 280,
      minSize: 280,
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <SortableHeader column={column} titleKey="admin.posts.columns.price" />
      ),
      cell: ({ row }) => {
        const price = row.getValue("price") as number;
        return (
          <span className="font-medium text-primary">
            {formatVietnamCurrency(price)}
          </span>
        );
      },
      size: 120,
      minSize: 120,
    },
    {
      accessorKey: "propertyTypeName",
      header: t("admin.posts.columns.type"),
      cell: ({ row }) => row.original.propertyTypeName,
      size: 120,
      minSize: 120,
    },
    {
      accessorKey: "status",
      header: t("admin.posts.columns.status"),
      cell: ({ row }) => {
        const { status } = row.original;
        const statusKey = getStatusKey(status);
        const variant = getStatusVariant(status);
        return (
          <Badge variant={variant}>
            {t(`admin.posts.status.${statusKey}`)}
          </Badge>
        );
      },
      size: 140,
      minSize: 140,
    },
    {
      accessorKey: "creatorName",
      header: t("admin.posts.columns.creator"),
      cell: ({ row }) => {
        const { creatorName, creatorEmail } = row.original;
        return (
          <div className="flex flex-col">
            <span className="font-medium line-clamp-1">{creatorName}</span>
            {creatorEmail && (
              <span className="text-xs text-muted-foreground line-clamp-1">
                {creatorEmail}
              </span>
            )}
          </div>
        );
      },
      size: 180,
      minSize: 180,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          titleKey="admin.posts.columns.createdAt"
        />
      ),
      cell: ({ row }) => formatDate(row.getValue("createdAt")),
      size: 120,
      minSize: 120,
    },
    {
      id: "actions",
      header: t("admin.posts.columns.actions"),
      cell: ({ row }) => {
        const post = row.original;
        return (
          <PostActionsCell
            postId={post.id}
            postTitle={post.title}
            status={post.status}
          />
        );
      },
      size: 120,
      minSize: 120,
      meta: {
        sticky: "right",
      },
    },
  ];
}
