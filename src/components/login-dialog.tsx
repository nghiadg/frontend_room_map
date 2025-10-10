import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { IconGoogle } from "@/components/icons";

const LoginDialog = NiceModal.create(() => {
  const t = useTranslations();
  const modal = useModal();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      modal.hide();
    } else {
      modal.show();
    }
  };

  return (
    <Dialog open={modal.visible} onOpenChange={handleOpenChange}>
      <DialogTitle>{t("auth.login")}</DialogTitle>
      <DialogContent className="sm:max-w-xs" showCloseButton={false}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">
              {t("auth.login_with_description")}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("auth.login_with_description_2")}
            </p>
          </div>
          <Button className="w-full">
            <IconGoogle />
            {t("auth.login_with_google")}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => modal.hide()}
          >
            {t("common.cancel")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});

export default LoginDialog;
