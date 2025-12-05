import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { IconGoogle } from "@/components/icons";
import { useAuth } from "@/hooks/use-auth";

const LoginDialog = NiceModal.create(() => {
  const t = useTranslations();
  const modal = useModal();
  const { signInWithGoogle, isLoading } = useAuth();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      modal.hide();
    }
  };

  return (
    <Dialog open={modal.visible} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xs" showCloseButton={false}>
        <DialogTitle>{t("auth.login")}</DialogTitle>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">
              {t("auth.login_with_description")}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("auth.login_with_description_2")}
            </p>
          </div>
          <Button
            className="w-full"
            onClick={signInWithGoogle}
            disabled={isLoading}
          >
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
