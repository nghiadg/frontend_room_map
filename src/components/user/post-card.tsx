"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreVerticalIcon,
  PencilIcon,
  EyeIcon,
  EyeOffIcon,
  TrashIcon,
  MapPinIcon,
  ImageIcon,
  CheckCircle2Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatMillions, MIN_IMAGE_COUNT } from "@/lib/format-utils";
import { useTranslations } from "next-intl";
import NiceModal from "@ebay/nice-modal-react";
import { MarkAsRentedDialog } from "@/app/(user)/(main)/posts/[id]/components/mark-as-rented-dialog";

type PostStatus =
  | "active"
  | "pending"
  | "draft"
  | "expired"
  | "hidden"
  | "rented";

type PostCardProps = {
  id: string;
  thumbnail: string;
  title: string;
  status: PostStatus;
  publishedAt: Date;
  price: number;
  deposit: number;
  area: number;
  address: string;
  propertyType: string;
  imageCount: number;
};

const statusConfig: Record<
  PostStatus,
  {
    variant: "default" | "secondary" | "destructive" | "outline";
    className: string;
  }
> = {
  active: {
    variant: "outline",
    className:
      "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100",
  },
  pending: {
    variant: "outline",
    className: "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100",
  },
  draft: {
    variant: "outline",
    className: "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100",
  },
  expired: {
    variant: "outline",
    className: "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100",
  },
  hidden: {
    variant: "outline",
    className: "bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100",
  },
  rented: {
    variant: "outline",
    className: "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100",
  },
};

export default function PostCard({
  id,
  thumbnail,
  title,
  status,
  publishedAt,
  price,
  deposit,
  area,
  address,
  propertyType,
  imageCount,
}: PostCardProps) {
  const t = useTranslations();

  // Get status label from i18n
  const statusLabel = t(`posts.manage.status.${status}`);

  const handleEdit = () => {
    console.log("Edit post:", id);
    // TODO: Navigate to edit page
  };

  const handleView = () => {
    console.log("View post:", id);
    // TODO: Navigate to post detail page
  };

  const handleToggleVisibility = () => {
    console.log("Toggle visibility:", id);
    // TODO: Toggle post visibility (hide/show)
  };

  const handleDelete = () => {
    console.log("Delete post:", id);
    // TODO: Show confirmation dialog then delete
  };

  const handleMarkAsRented = () => {
    NiceModal.show(MarkAsRentedDialog, {
      postId: parseInt(id, 10),
      postTitle: title,
    });
  };

  // Check if post can be marked as rented (not already rented)
  const canMarkAsRented = status !== "rented";

  const statusStyle = statusConfig[status];

  return (
    <article className="group flex flex-col gap-3">
      {/* Image with Badges */}
      <Link href={`/posts/${id}`} className="block">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted">
          <Image
            src={thumbnail}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-all duration-300 group-hover:scale-105"
            priority={false}
          />
          {/* Status Badge - Top Left */}
          <Badge
            variant={statusStyle.variant}
            className={cn(
              "absolute left-3 top-3 backdrop-blur-sm",
              statusStyle.className
            )}
          >
            {statusLabel}
          </Badge>
          {/* Property Type Badge - Bottom Left */}
          <Badge
            variant="secondary"
            className="absolute left-3 bottom-3 backdrop-blur-sm text-xs font-normal"
          >
            {propertyType}
          </Badge>
        </div>
      </Link>

      {/* Content */}
      <div className="space-y-2.5">
        {/* Title with Action Menu */}
        <div className="flex items-start gap-2">
          <div className="flex-1 space-y-1.5">
            <Link
              href={`/posts/${id}`}
              className="text-base font-semibold leading-normal transition-colors hover:text-primary line-clamp-2"
            >
              {title}
            </Link>
            <p className="text-xs text-muted-foreground">
              {format(publishedAt, "d 'Th'M, yyyy", { locale: vi })}
            </p>
          </div>

          {/* Action Menu Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 shrink-0"
                onClick={(e) => e.preventDefault()}
              >
                <MoreVerticalIcon className="h-4 w-4" />
                <span className="sr-only">
                  {t("posts.card.actions.aria_label")}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleEdit}>
                <PencilIcon className="mr-2 h-4 w-4" />
                {t("posts.card.actions.edit")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleView}>
                <EyeIcon className="mr-2 h-4 w-4" />
                {t("posts.card.actions.view")}
              </DropdownMenuItem>
              {canMarkAsRented && (
                <DropdownMenuItem onClick={handleMarkAsRented}>
                  <CheckCircle2Icon className="mr-2 h-4 w-4" />
                  {t("posts.card.actions.mark_as_rented")}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={handleToggleVisibility}>
                {status === "hidden" ? (
                  <>
                    <EyeIcon className="mr-2 h-4 w-4" />
                    {t("posts.card.actions.show")}
                  </>
                ) : (
                  <>
                    <EyeOffIcon className="mr-2 h-4 w-4" />
                    {t("posts.card.actions.hide")}
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete} variant="destructive">
                <TrashIcon className="mr-2 h-4 w-4" />
                {t("posts.card.actions.delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Property Details - Modern Card Style */}
        <div className="space-y-3">
          {/* Price with Image Count */}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold tracking-tight">
                {formatMillions(price)}
              </span>
              <span className="text-sm text-muted-foreground">
                {t("posts.card.price_unit")}
              </span>
            </div>
            <div
              className={cn(
                "flex items-center gap-1 text-xs",
                imageCount < MIN_IMAGE_COUNT
                  ? "text-orange-500 dark:text-orange-400"
                  : "text-muted-foreground"
              )}
            >
              <ImageIcon className="h-3.5 w-3.5" />
              <span>{imageCount}</span>
            </div>
          </div>

          {/* Info Grid - Subtle background */}
          <div className="rounded-lg bg-muted/30 p-3 space-y-2">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
              <div className="text-muted-foreground">
                {t("posts.card.deposit_label")}: {formatMillions(deposit)}
                {t("posts.card.deposit_unit")}
              </div>
              <div className="text-muted-foreground text-right">
                {t("posts.card.area_label")}: {area}m²
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-1.5 text-muted-foreground pt-1 border-t border-border/50">
              <MapPinIcon className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              <span className="line-clamp-1 text-xs">{address}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
