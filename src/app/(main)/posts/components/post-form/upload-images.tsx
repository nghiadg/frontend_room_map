import ImageGallery from "@/components/image-gallery";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { ERROR_MESSAGE } from "@/constants/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  images: z
    .array(
      z.object({
        file: z.instanceof(File),
        previewUrl: z.string(),
        alt: z.string().optional(),
        id: z.string(),
      })
    )
    .min(1, { message: ERROR_MESSAGE.REQUIRED })
    .max(10, { message: ERROR_MESSAGE.MAX_LENGTH(10) }),
});

export type UploadImagesData = z.infer<typeof schema>;

type UploadImagesProps = {
  onPreviousStep: () => void;
  onSubmit: (data: UploadImagesData) => void;
};

export default function UploadImages({
  onPreviousStep,
  onSubmit,
}: UploadImagesProps) {
  const t = useTranslations();
  const { handleSubmit, control } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      images: [],
    },
  });

  const innerOnSubmit = (data: UploadImagesData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(innerOnSubmit)}>
      <FieldGroup>
        <Field>
          <FieldLabel>{t("posts.upload_images.title")}</FieldLabel>
          <FieldDescription>
            {t("posts.upload_images.description")}
          </FieldDescription>
          <Controller
            control={control}
            name="images"
            render={({ field: { onChange, value }, fieldState }) => (
              <>
                <ImageGallery
                  images={value}
                  onImagesChange={onChange}
                  onImageRemove={onChange}
                  imageClassName="w-[128px] h-[128px]"
                  emptyClassName="h-[280px]"
                />
                {fieldState.invalid && (
                  <FieldError
                    errors={[{ message: fieldState.error?.message }]}
                  />
                )}
              </>
            )}
          />
        </Field>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onPreviousStep} type="button">
            {t("common.back")}
          </Button>
          <Button variant="default" type="submit">
            {t("common.create")}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
