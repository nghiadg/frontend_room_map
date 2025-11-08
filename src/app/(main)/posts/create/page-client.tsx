"use client";

import { ImageFile } from "@/types/file";
import { useState } from "react";
import PostForm from "../components/post-form/post-form";
import { Amenity } from "@/types/amenities";
import { PropertyType } from "@/types/property-types";
import { Term } from "@/types/terms";

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
  const [images, setImages] = useState<ImageFile[]>([]);
  return (
    <>
      <PostForm
        amenities={amenities}
        propertyTypes={propertyTypes}
        terms={terms}
      />
    </>
  );
}
