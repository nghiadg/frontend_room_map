"use client";

import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MapPinOff } from "lucide-react";
import { useTranslations } from "next-intl";

const LocationDeniedDialog = NiceModal.create(() => {
  const t = useTranslations("map.permission_denied");
  const modal = useModal();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      modal.hide();
    }
  };

  const handleClose = () => {
    modal.hide();
  };

  return (
    <Dialog open={modal.visible} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <DialogHeader className="items-center text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <MapPinOff className="h-8 w-8 text-destructive" />
          </div>
          <DialogTitle className="text-xl">{t("title")}</DialogTitle>
          <DialogDescription className="text-center">
            {t("description")}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-center">
          <Button onClick={handleClose} className="w-full sm:w-auto">
            {t("close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

export default LocationDeniedDialog;
