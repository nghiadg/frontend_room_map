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
import { MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

type LocationPermissionDialogProps = {
  onAllow: () => void;
  onDeny: () => void;
};

const LocationPermissionDialog =
  NiceModal.create<LocationPermissionDialogProps>(({ onAllow, onDeny }) => {
    const t = useTranslations("map.permission");
    const modal = useModal();

    const handleOpenChange = (open: boolean) => {
      if (!open) {
        modal.hide();
      }
    };

    const handleAllow = () => {
      modal.hide();
      onAllow();
    };

    const handleDeny = () => {
      modal.hide();
      onDeny();
    };

    return (
      <Dialog open={modal.visible} onOpenChange={handleOpenChange}>
        <DialogContent showCloseButton={false} className="sm:max-w-md">
          <DialogHeader className="items-center text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <MapPin className="h-8 w-8 text-primary" />
            </div>
            <DialogTitle className="text-xl">{t("title")}</DialogTitle>
            <DialogDescription className="text-center">
              {t("description")}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <Button onClick={handleAllow} className="w-full">
              {t("allow")}
            </Button>
            <Button variant="ghost" onClick={handleDeny} className="w-full">
              {t("deny")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  });

export default LocationPermissionDialog;
