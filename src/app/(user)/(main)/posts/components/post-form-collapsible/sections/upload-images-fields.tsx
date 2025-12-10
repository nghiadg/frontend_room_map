"use client";

import ImageGallery from "@/components/user/image-gallery";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { memo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { PostFormValues } from "../schema";

function UploadImagesFieldsComponent() {
  const { control } = useFormContext<PostFormValues>();

  return (
    <FieldGroup>
      <Field>
        <Controller
          control={control}
          name="images"
          render={({ field: { onChange, value }, fieldState }) => (
            <>
              <ImageGallery
                images={value}
                onImagesChange={onChange}
                onImageRemove={onChange}
                maxImages={10}
              />
              {fieldState.invalid && (
                <FieldError errors={[{ message: fieldState.error?.message }]} />
              )}
            </>
          )}
        />
      </Field>
    </FieldGroup>
  );
}

export const UploadImagesFields = memo(UploadImagesFieldsComponent);
