import { Button } from "@/components/ui/button";
import { EditIcon, HandCoinsIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export default function PostActions() {
  const t = useTranslations();
  return (
    <div className="flex items-center gap-2 mb-4 justify-end">
      <Button variant="outline" size="sm">
        <HandCoinsIcon className="w-4 h-4" />
        <span>{t("common.leased_now")}</span>
      </Button>
      <Button variant="outline" size="sm">
        <EditIcon className="w-4 h-4" />
        <span>{t("common.edit")}</span>
      </Button>
    </div>
  );
}
