"use client";

import { useState } from "react";
import { Lock, Unlock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTranslations } from "next-intl";
import { useLockUser } from "../hooks/use-lock-user";

type UserActionsCellProps = {
  profileId: number;
  userName: string;
  isLocked: boolean;
  isAdmin: boolean;
};

export function UserActionsCell({
  profileId,
  userName,
  isLocked,
  isAdmin,
}: UserActionsCellProps) {
  const t = useTranslations();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { mutate: lockUser, isPending } = useLockUser();

  // Don't show lock button for admin users
  if (isAdmin) {
    return <span className="text-muted-foreground">—</span>;
  }

  const handleConfirm = () => {
    lockUser(
      { profileId, isLocked: !isLocked },
      {
        onSuccess: () => setShowConfirmDialog(false),
        onError: () => setShowConfirmDialog(false),
      }
    );
  };

  return (
    <>
      <Button
        variant={isLocked ? "outline" : "ghost"}
        size="icon"
        onClick={() => setShowConfirmDialog(true)}
        disabled={isPending}
        className={
          isLocked
            ? "text-emerald-600 hover:text-emerald-700"
            : "text-destructive hover:text-destructive/90"
        }
        title={
          isLocked
            ? t("admin.users.unlock.button")
            : t("admin.users.lock.button")
        }
      >
        {isLocked ? (
          <Unlock className="h-4 w-4" />
        ) : (
          <Lock className="h-4 w-4" />
        )}
      </Button>

      <AlertDialog
        open={showConfirmDialog}
        onOpenChange={(open) => !isPending && setShowConfirmDialog(open)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isLocked
                ? t("admin.users.unlock.title")
                : t("admin.users.lock.title")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isLocked
                ? t("admin.users.unlock.description", { name: userName })
                : t("admin.users.lock.description", { name: userName })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>
              {t("common.cancel")}
            </AlertDialogCancel>
            <Button
              onClick={handleConfirm}
              disabled={isPending}
              className={
                isLocked ? "" : "bg-destructive hover:bg-destructive/90"
              }
            >
              {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isLocked
                ? t("admin.users.unlock.confirm")
                : t("admin.users.lock.confirm")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
