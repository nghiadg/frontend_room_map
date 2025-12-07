"use client";

import NiceModal, { useModal } from "@ebay/nice-modal-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Rocket } from "lucide-react";
import { type ComingSoonFeatureKey } from "@/constants/coming-soon";

export type ComingSoonDialogProps = {
  /**
   * Feature key for the feature name.
   * Must match a key in vn.json under "coming_soon.features".
   * @example "search" | "favorites" | "notifications"
   */
  featureKey?: ComingSoonFeatureKey;
};

const ComingSoonDialog = NiceModal.create<ComingSoonDialogProps>(
  ({ featureKey }) => {
    const t = useTranslations();
    const modal = useModal();

    const handleOpenChange = (open: boolean) => {
      if (!open) {
        modal.hide();
      }
    };

    const featureName = featureKey
      ? t(`coming_soon.features.${featureKey}`)
      : undefined;

    return (
      <Dialog open={modal.visible} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-sm text-center" showCloseButton>
          <div className="flex flex-col items-center gap-4 py-2">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Rocket
                className="h-8 w-8 text-primary animate-bounce"
                aria-hidden="true"
              />
            </div>
            <div className="space-y-2">
              <DialogTitle className="text-xl">
                {t("coming_soon.title")}
              </DialogTitle>
              <DialogDescription className="text-base">
                {featureName
                  ? t("coming_soon.description_with_feature", { featureName })
                  : t("coming_soon.description")}
              </DialogDescription>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("coming_soon.stay_tuned")}
            </p>
            <Button
              className="w-full max-w-[200px]"
              onClick={() => modal.hide()}
            >
              {t("coming_soon.got_it")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
);

export default ComingSoonDialog;
