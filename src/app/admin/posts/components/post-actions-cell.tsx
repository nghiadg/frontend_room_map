"use client";

import { Button } from "@/components/ui/button";
import { Trash2, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import NiceModal from "@ebay/nice-modal-react";
import { DeletePostDialog } from "./delete-post-dialog";
import { useAdminBumpPost } from "../hooks/use-admin-bump-post";
import { POST_STATUS } from "@/constants/post-status";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type PostActionsCellProps = {
  postId: number;
  postTitle: string;
  status: string;
};

export function PostActionsCell({
  postId,
  postTitle,
  status,
}: PostActionsCellProps) {
  const t = useTranslations();
  const { mutate: bumpPost, isPending: isBumping } = useAdminBumpPost();

  // Don't show actions for deleted posts
  if (status === POST_STATUS.DELETED) {
    return null;
  }

  const handleDelete = () => {
    NiceModal.show(DeletePostDialog, {
      postId,
      postTitle,
    });
  };

  const handleBump = () => {
    bumpPost(
      { postId },
      {
        onSuccess: () => {
          toast.success(t("admin.posts.actions.bump_success"));
        },
        onError: (error) => {
          toast.error(error.message || t("admin.posts.actions.bump_error"));
        },
      }
    );
  };

  const isExpired = status === POST_STATUS.EXPIRED;

  return (
    <div className="flex justify-center gap-1">
      {isExpired && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
              onClick={handleBump}
              disabled={isBumping}
              aria-label={t("admin.posts.actions.bump")}
            >
              <RotateCcw
                className={`h-4 w-4 ${isBumping ? "animate-spin" : ""}`}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("admin.posts.actions.bump")}</p>
          </TooltipContent>
        </Tooltip>
      )}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleDelete}
            aria-label={t("admin.posts.actions.delete")}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t("admin.posts.actions.delete")}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
