"use client";
import { Button } from "@/components/ui/button";
import { PAGE_PATH } from "@/constants/page";
import { EditIcon, HandCoinsIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

type PostActionsProps = {
  postId: number;
};
export default function PostActions({ postId }: PostActionsProps) {
  const t = useTranslations();
  const router = useRouter();

  const handleEdit = () => {
    router.push(PAGE_PATH.POSTS_EDIT(postId.toString()));
  };

  return (
    <div className="flex items-center gap-2 mb-4 justify-end">
      <Button variant="outline" size="sm">
        <HandCoinsIcon className="w-4 h-4" />
        <span>{t("common.leased_now")}</span>
      </Button>
      <Button variant="outline" size="sm" onClick={handleEdit}>
        <EditIcon className="w-4 h-4" />
        <span>{t("common.edit")}</span>
      </Button>
    </div>
  );
}
