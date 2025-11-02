"use client";
import { FieldGroup } from "@/components/ui/field";
import { ImageFile } from "@/types/file";
import { PostFormData } from "@/types/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, Resolver, useForm } from "react-hook-form";
import { z } from "zod";
import BasicInformation from "./basic-information";
import FormActions from "./form-actions";
import Furnished from "./furnished";
import PriceAndTerms from "./price-and-terms";
import PropertyDetails from "./property-details";
import TitleAndImages from "./title-and-images";

const schema = z.object({
  province: z.object({
    code: z.string(),
    name: z.string(),
  }),
  district: z.object({
    code: z.string(),
    name: z.string(),
    provinceCode: z.string(),
  }),
  ward: z.object({
    code: z.string(),
    name: z.string(),
    districtCode: z.string(),
  }),
});

type PostFormProps = {
  images: ImageFile[];
  onImagesChange: (images: ImageFile[]) => void;
  mode: "create" | "edit";
};

export default function PostForm({
  images,
  onImagesChange,
  mode = "create",
}: PostFormProps) {
  const methods = useForm<PostFormData>({
    resolver: zodResolver(schema) as unknown as Resolver<PostFormData>,
    defaultValues: {
      province: undefined,
      district: undefined,
      ward: undefined,
    },
  });

  const onSubmit = (data: PostFormData) => {
    console.log(data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <FormActions
          mode={mode}
          onPreview={() => {}}
          onCancel={() => {}}
          onSubmit={() => {}}
          isSubmitting={false}
        />
        <div className="flex flex-col gap-4 md:gap-6 lg:gap-8 mt-4 md:mt-6 lg:mt-8">
          <div className="flex flex-col lg:flex-row gap-4 md:gap-6 lg:gap-8">
            <div className="w-full lg:w-2/3 order-2 lg:order-1">
              <FieldGroup>
                <BasicInformation />
                <PriceAndTerms />
                <PropertyDetails />
                <Furnished />
              </FieldGroup>
            </div>
            <div className="w-full lg:w-1/3 order-1 lg:order-2">
              <TitleAndImages images={images} onImagesChange={onImagesChange} />
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
