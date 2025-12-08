"use client";

import NiceModal, { useModal } from "@ebay/nice-modal-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useDeleteUserPost } from "../hooks/use-delete-user-post";
import { toast } from "sonner";
import { Loader2, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

type DeleteUserPostDialogProps = {
  postId: number;
  postTitle: string;
  /** Optional path to redirect after successful deletion (e.g., from post details page) */
  redirectPath?: string;
};

export const DeleteUserPostDialog = NiceModal.create<DeleteUserPostDialogProps>(
  ({ postId, postTitle, redirectPath }) => {
    const modal = useModal();
    const t = useTranslations();
    const router = useRouter();
    const { mutate: deletePost, isPending } = useDeleteUserPost();

    const handleClose = () => {
      if (!isPending) {
        modal.hide();
      }
    };

    const handleConfirm = () => {
      deletePost(
        { postId },
        {
          onSuccess: () => {
            toast.success(t("posts.deleteUserPost.success"));
            modal.hide();
            // Redirect if provided (e.g., from post details page)
            if (redirectPath) {
              router.push(redirectPath);
            }
          },
          onError: () => {
            toast.error(t("posts.deleteUserPost.error"));
          },
        }
      );
    };

    return (
      <Dialog open={modal.visible} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("posts.deleteUserPost.title")}</DialogTitle>
            <DialogDescription>
              {t("posts.deleteUserPost.description")}{" "}
              <span className="font-semibold text-foreground">{postTitle}</span>
              ?
            </DialogDescription>
          </DialogHeader>

          <div
            role="alert"
            className="flex items-start gap-3 rounded-lg bg-red-50 dark:bg-red-950/50 p-3 text-red-800 dark:text-red-200"
          >
            <AlertTriangle
              className="h-5 w-5 flex-shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <p className="text-sm">{t("posts.deleteUserPost.warning")}</p>
          </div>

          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
            >
              {t("common.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirm}
              disabled={isPending}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("posts.deleteUserPost.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);
