"use client";
import { Button } from "@/components/ui/button";
import { usePermissions } from "@/hooks/use-permissions";
import { PAGE_PATH } from "@/constants/page";
import { EditIcon, CheckCircle2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

type PostActionsProps = {
  postId: number;
  postOwnerProfileId: number;
};

export default function PostActions({
  postId,
  postOwnerProfileId,
}: PostActionsProps) {
  const t = useTranslations();
  const router = useRouter();
  const { canEditOwnPost, canMarkOwnPostAsRented, isLoading } =
    usePermissions();

  const handleEdit = () => {
    router.push(PAGE_PATH.POSTS_EDIT(postId.toString()));
  };

  // Don't render anything while loading permissions
  if (isLoading) {
    return null;
  }

  // Only show actions if user owns this post
  const canEdit = canEditOwnPost(postOwnerProfileId);
  const canMarkAsRented = canMarkOwnPostAsRented(postOwnerProfileId);

  // Hide entire component if user can't do anything
  if (!canEdit && !canMarkAsRented) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 mb-4 justify-end">
      {canMarkAsRented && (
        <Button variant="outline" size="sm">
          <CheckCircle2Icon className="w-4 h-4" />
          <span>{t("common.leased_now")}</span>
        </Button>
      )}
      {canEdit && (
        <Button variant="outline" size="sm" onClick={handleEdit}>
          <EditIcon className="w-4 h-4" />
          <span>{t("common.edit")}</span>
        </Button>
      )}
    </div>
  );
}
