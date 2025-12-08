"use client";
import { Button } from "@/components/ui/button";
import { usePermissions } from "@/hooks/use-permissions";
import { PAGE_PATH } from "@/constants/page";
import { EditIcon, CheckCircle2Icon, TrashIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import NiceModal from "@ebay/nice-modal-react";
import { MarkAsRentedDialog } from "./mark-as-rented-dialog";
import { DeleteUserPostDialog } from "@/app/(user)/(main)/account/posts/components/delete-user-post-dialog";

type PostActionsProps = {
  postId: number;
  postOwnerProfileId: number;
  postTitle: string;
  isRented?: boolean;
};

export default function PostActions({
  postId,
  postOwnerProfileId,
  postTitle,
  isRented = false,
}: PostActionsProps) {
  const t = useTranslations();
  const router = useRouter();
  const {
    canEditOwnPost,
    canMarkOwnPostAsRented,
    canDeleteOwnPost,
    isLoading,
  } = usePermissions();

  const handleEdit = () => {
    router.push(PAGE_PATH.POSTS_EDIT(postId.toString()));
  };

  const handleMarkAsRented = () => {
    NiceModal.show(MarkAsRentedDialog, {
      postId,
      postTitle,
    });
  };

  const handleDelete = () => {
    NiceModal.show(DeleteUserPostDialog, {
      postId,
      postTitle,
      redirectPath: PAGE_PATH.ACCOUNT_MANAGE_POSTS,
    });
  };

  // Don't render anything while loading permissions
  if (isLoading) {
    return null;
  }

  // Only show actions if user owns this post
  const canEdit = canEditOwnPost(postOwnerProfileId);
  const canMarkAsRented = canMarkOwnPostAsRented(postOwnerProfileId);
  const canDelete = canDeleteOwnPost(postOwnerProfileId);

  // Hide mark as rented button if post is already rented
  const showMarkAsRentedButton = canMarkAsRented && !isRented;
  // Hide edit button if post is already rented
  const showEditButton = canEdit && !isRented;
  // Show delete button for owner (even if rented)
  const showDeleteButton = canDelete;

  // Hide entire component if user can't do anything
  if (!showEditButton && !showMarkAsRentedButton && !showDeleteButton) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 mb-4 justify-end">
      {showMarkAsRentedButton && (
        <Button variant="outline" size="sm" onClick={handleMarkAsRented}>
          <CheckCircle2Icon className="w-4 h-4" />
          <span>{t("common.leased_now")}</span>
        </Button>
      )}
      {showEditButton && (
        <Button variant="outline" size="sm" onClick={handleEdit}>
          <EditIcon className="w-4 h-4" />
          <span>{t("common.edit")}</span>
        </Button>
      )}
      {showDeleteButton && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleDelete}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <TrashIcon className="w-4 h-4" />
          <span>{t("common.delete")}</span>
        </Button>
      )}
    </div>
  );
}
