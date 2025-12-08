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
import { useMarkAsRented } from "../hooks/use-mark-as-rented";
import { toast } from "sonner";
import { Loader2, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

type MarkAsRentedDialogProps = {
  postId: number;
  postTitle: string;
};

export const MarkAsRentedDialog = NiceModal.create<MarkAsRentedDialogProps>(
  ({ postId, postTitle }) => {
    const modal = useModal();
    const t = useTranslations();
    const router = useRouter();
    const { mutate: markAsRented, isPending } = useMarkAsRented();

    const handleClose = () => {
      if (!isPending) {
        modal.hide();
      }
    };

    const handleConfirm = () => {
      markAsRented(
        { postId },
        {
          onSuccess: () => {
            toast.success(t("posts.markAsRented.success"));
            modal.hide();
            // Refresh the page to show updated status
            router.refresh();
          },
          onError: () => {
            toast.error(t("posts.markAsRented.error"));
          },
        }
      );
    };

    return (
      <Dialog open={modal.visible} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("posts.markAsRented.title")}</DialogTitle>
            <DialogDescription>
              {t("posts.markAsRented.description")}{" "}
              <span className="font-semibold text-foreground">{postTitle}</span>
              ?
            </DialogDescription>
          </DialogHeader>

          <div
            role="alert"
            className="flex items-start gap-3 rounded-lg bg-amber-50 dark:bg-amber-950/50 p-3 text-amber-800 dark:text-amber-200"
          >
            <AlertTriangle
              className="h-5 w-5 flex-shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <p className="text-sm">{t("posts.markAsRented.warning")}</p>
          </div>

          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
            >
              {t("common.cancel")}
            </Button>
            <Button onClick={handleConfirm} disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("posts.markAsRented.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);
