import ImageGallery from "@/components/image-gallery";
import { FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageFile } from "@/types/file";
import { useTranslations } from "next-intl";

type TitleAndImagesProps = {
  images: ImageFile[];
  onImagesChange: (images: ImageFile[]) => void;
};

export default function TitleAndImages({
  images,
  onImagesChange,
}: TitleAndImagesProps) {
  const t = useTranslations();
  return (
    <FieldGroup>
      <FieldSet>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="title">
              {t("posts.create.form.title")}
            </FieldLabel>
            <Input
              id="title"
              placeholder={t("posts.create.form.title_placeholder")}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="description">
              {t("posts.create.form.description")}
            </FieldLabel>
            <Textarea
              id="description"
              placeholder={t("posts.create.form.description_placeholder")}
              className="min-h-[100px]"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="gallery">
              {t("posts.create.form.gallery")}
            </FieldLabel>
            <ImageGallery
              images={images}
              onImagesChange={onImagesChange}
              onImageRemove={onImagesChange}
            />
          </Field>
        </FieldGroup>
      </FieldSet>
    </FieldGroup>
  );
}
