"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

type PhoneRequiredDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function PhoneRequiredDialog({
  open,
  onOpenChange,
}: PhoneRequiredDialogProps) {
  const t = useTranslations();
  const router = useRouter();

  const handleAction = () => {
    onOpenChange(false);
    router.push("/account/profile");
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("posts.phone_required.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("posts.phone_required.description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleAction}>
            {t("posts.phone_required.action")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
