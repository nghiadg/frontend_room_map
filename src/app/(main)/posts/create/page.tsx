"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ImageFile } from "@/types/file";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import PostForm from "../components/post-form/post-form";

export default function CreatePostPage() {
  const t = useTranslations();
  const [images, setImages] = useState<ImageFile[]>([]);

  return (
    <div className="w-full">
      <Breadcrumb className="mb-4 md:mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href="/">{t("common.home")}</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <p>{t("posts.create.title")}</p>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <PostForm images={images} onImagesChange={setImages} mode="create" />
    </div>
  );
}
