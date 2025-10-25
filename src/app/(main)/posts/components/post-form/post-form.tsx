"use client";
import { FieldGroup } from "@/components/ui/field";
import BasicInformation from "./basic-information";
import PriceAndTerms from "./price-and-terms";
import PropertyDetails from "./property-details";
import Furnished from "./furnished";
import { ImageFile } from "@/types/file";
import TitleAndImages from "./title-and-images";
import FormActions from "./form-actions";

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
  return (
    <form action="">
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
  );
}
