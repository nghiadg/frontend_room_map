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
  const { mutate: createPostMutation } = useMutation({
    mutationFn: (data: PostFormData) => createPost(data),
    onSuccess: (postId) => {
      toast.success(t("posts.create.success"));
      router.push(`/posts/${postId}`);
    },
    onError: () => {
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
    </>
  );
}
