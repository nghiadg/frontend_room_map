"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { useDeletePost } from "../hooks/use-delete-post";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type DeletePostDialogProps = {
  postId: number;
  postTitle: string;
};

export const DeletePostDialog = NiceModal.create<DeletePostDialogProps>(
  ({ postId, postTitle }) => {
    const modal = useModal();
    const t = useTranslations();
    const [reason, setReason] = useState("");
    const { mutate: deletePost, isPending } = useDeletePost();

    const handleClose = () => {
      if (!isPending) {
        modal.hide();
        setReason("");
      }
    };

    const handleConfirm = () => {
      if (!reason.trim()) {
        toast.error(t("admin.posts.deleteDialog.reasonRequired"));
        return;
      }

      deletePost(
        { postId, reason: reason.trim() },
        {
          onSuccess: () => {
            toast.success(t("admin.posts.deleteDialog.success"));
            modal.hide();
            setReason("");
          },
          onError: () => {
            toast.error(t("admin.posts.deleteDialog.error"));
          },
        }
      );
    };

    return (
      <Dialog open={modal.visible} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("admin.posts.deleteDialog.title")}</DialogTitle>
            <DialogDescription>
              {t("admin.posts.deleteDialog.description")}{" "}
              <span className="font-semibold text-foreground">{postTitle}</span>
              ?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2">
            <Label htmlFor="reason">
              {t("admin.posts.deleteDialog.reasonLabel")}
              <span className="text-destructive"> *</span>
            </Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={t("admin.posts.deleteDialog.reasonPlaceholder")}
              rows={3}
              disabled={isPending}
            />
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
              disabled={isPending || !reason.trim()}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("admin.posts.deleteDialog.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);
