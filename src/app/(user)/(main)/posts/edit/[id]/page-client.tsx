"use client";

import { editPost } from "@/services/client/posts";
import { PostFormData } from "@/services/types/posts";
import { Amenity } from "@/types/amenities";
import { Post } from "@/types/post";
import { PropertyType } from "@/types/property-types";
import { Term } from "@/types/terms";
import { useMutation } from "@tanstack/react-query";
import PostFormCollapsible from "../../components/post-form-collapsible";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useLoadingGlobal } from "@/store/loading-store";
import { useRouter } from "next/navigation";

type EditPostPageClientProps = {
  amenities: Amenity[];
  propertyTypes: PropertyType[];
  terms: Term[];
  post: Post;
};
export default function EditPostPageClient({
  amenities,
  propertyTypes,
  terms,
  post,
}: EditPostPageClientProps) {
  const t = useTranslations();
  const router = useRouter();
  const { setIsLoading } = useLoadingGlobal();
  const { mutate: editPostMutation } = useMutation({
    mutationFn: (data: PostFormData) => editPost(post.id, data),
    onSuccess: () => {
      toast.success(t("posts.edit.success"));
      router.push(`/posts/${post.id}`);
    },
    onError: () => {
      toast.error(t("posts.edit.error"));
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const onSubmit = (data: PostFormData) => {
    setIsLoading(true);
    editPostMutation(data);
  };

  return (
    <>
      <PostFormCollapsible
        amenities={amenities}
        propertyTypes={propertyTypes}
        terms={terms}
        onSubmit={onSubmit}
        post={post}
        labelSubmit={t("posts.edit.submit")}
      />
    </>
  );
}
