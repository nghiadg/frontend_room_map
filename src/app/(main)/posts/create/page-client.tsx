"use client";

import { createPost } from "@/services/client/posts";
import { CreatePostData } from "@/services/types/posts";
import { Amenity } from "@/types/amenities";
import { PropertyType } from "@/types/property-types";
import { Term } from "@/types/terms";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import PostForm from "../components/post-form/post-form";

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
  const { mutate: createPostMutation } = useMutation({
    mutationFn: (data: CreatePostData) => createPost(data),
    onSuccess: () => {
      toast.success("Post created successfully");
    },
    onError: () => {
      toast.error("Failed to create post");
    },
  });

  const onSubmit = (data: CreatePostData) => {
    createPostMutation(data);
  };
  return (
    <>
      <PostForm
        amenities={amenities}
        propertyTypes={propertyTypes}
        terms={terms}
        onSubmit={onSubmit}
      />
    </>
  );
}
