"use client";

import { createPost } from "@/services/client/posts";
import { PostFormData } from "@/services/types/posts";
import { Amenity } from "@/types/amenities";
import { PropertyType } from "@/types/property-types";
import { Term } from "@/types/terms";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import PostFormCollapsible from "../components/post-form-collapsible";
import { useTranslations } from "next-intl";
import { useLoadingGlobal } from "@/store/loading-store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PhoneRequiredDialog } from "@/components/dialogs/phone-required-dialog";
import { API_ERROR_CODE } from "@/constants/error-message";
import { HttpClientError } from "@/lib/http-client";

type CreatePostPageClientProps = {
  amenities: Amenity[];
  propertyTypes: PropertyType[];
  terms: Term[];
};

export default function CreatePostPageClient({
  amenities,
  propertyTypes,
  terms,
}: CreatePostPageClientProps) {
  const t = useTranslations();
  const router = useRouter();
  const { setIsLoading } = useLoadingGlobal();
  const [showPhoneDialog, setShowPhoneDialog] = useState(false);

  const { mutate: createPostMutation } = useMutation({
    mutationFn: (data: PostFormData) => createPost(data),
    onSuccess: (postId) => {
      toast.success(t("posts.create.success"));
      router.push(`/posts/${postId}`);
    },
    onError: (error: Error) => {
      // Check if error is HttpClientError with PHONE_REQUIRED code
      if (error instanceof HttpClientError) {
        const body = error.body as { code?: string } | null;
        if (body?.code === API_ERROR_CODE.PHONE_REQUIRED) {
          setShowPhoneDialog(true);
          return;
        }
      }
      toast.error(t("posts.create.error"));
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const onSubmit = (data: PostFormData) => {
    setIsLoading(true);
    createPostMutation(data);
  };

  return (
    <>
      <PostFormCollapsible
        amenities={amenities}
        propertyTypes={propertyTypes}
        terms={terms}
        onSubmit={onSubmit}
        labelSubmit={t("posts.create.submit")}
      />
      <PhoneRequiredDialog
        open={showPhoneDialog}
        onOpenChange={setShowPhoneDialog}
      />
    </>
  );
}
