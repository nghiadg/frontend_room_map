"use client";

import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  convertCurrencyToNumber,
  convertNumberToCurrency,
} from "@/lib/input-utils";
import { getImageUrl } from "@/lib/s3/image-url";
import { toast } from "sonner";
import { PostFormData } from "@/services/types/posts";
import { Amenity } from "@/types/amenities";
import { ImageFile } from "@/types/file";
import { Post } from "@/types/post";
import { PropertyType } from "@/types/property-types";
import { Term } from "@/types/terms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";
import { FormProvider, useForm, useFormState, useWatch } from "react-hook-form";
import { FormSectionAccordion } from "./form-section-accordion";
import {
  FORM_SECTIONS,
  FORM_SECTION_KEYS,
  postFormSchema,
  PostFormValues,
  SECTION_FIELDS,
} from "./schema";
import {
  BasicInformationFields,
  LocationFields,
  PriceAndTermsFields,
  UploadImagesFields,
} from "./sections";
import { getSectionStatus } from "./utils";

type PostFormCollapsibleProps = {
  amenities: Amenity[];
  propertyTypes: PropertyType[];
  terms: Term[];
  onSubmit: (data: PostFormData) => void;
  post?: Post;
  labelSubmit: string;
};

export default function PostFormCollapsible({
  amenities,
  propertyTypes,
  terms,
  onSubmit,
  post,
  labelSubmit,
}: PostFormCollapsibleProps) {
  const t = useTranslations();

  // Track which accordion sections are open
  const [openSections, setOpenSections] = useState<string[]>([
    FORM_SECTION_KEYS.BASIC_INFORMATION,
  ]);

  // Build initial form values from existing post data
  const defaultValues = useMemo<PostFormValues>(() => {
    const initialImages: ImageFile[] = (post?.postImages ?? []).map(
      (image) => ({
        file: new File([], image.url),
        previewUrl: getImageUrl(image.url),
        id: image.id.toString(),
        alt: `${post?.title} - ${image.id}`,
        isUploaded: true,
      })
    );

    return {
      // Basic Information
      title: post?.title ?? "",
      description: post?.description ?? "",
      propertyType: propertyTypes.find((pt) => pt.id === post?.propertyTypeId),
      area: post?.area?.toString() ?? "",
      amenities: post?.postAmenities?.map((amenity) => amenity.amenities) ?? [],

      // Location
      province: post?.provinces ?? undefined,
      district: post?.districts ?? undefined,
      ward: post?.wards ?? undefined,
      address: post?.address ?? "",
      lat: post?.lat ?? undefined,
      lng: post?.lng ?? undefined,

      // Price & Terms
      price: post?.price != null ? convertNumberToCurrency(post.price) : "",
      deposit:
        post?.deposit != null ? convertNumberToCurrency(post.deposit) : "",
      electricityBill:
        post?.electricityBill != null
          ? convertNumberToCurrency(post.electricityBill)
          : "",
      waterBill:
        post?.waterBill != null ? convertNumberToCurrency(post.waterBill) : "",
      internetBill:
        post?.internetBill != null
          ? convertNumberToCurrency(post.internetBill)
          : "",
      otherBill:
        post?.otherBill != null ? convertNumberToCurrency(post.otherBill) : "",
      waterBillUnit: post?.waterBillUnit ?? "month",
      internetBillUnit: post?.internetBillUnit ?? "month",
      terms: post?.postTerms?.map((term) => term.terms.id) ?? [],

      // Images
      images: initialImages,
    };
  }, [post, propertyTypes]);

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const { handleSubmit, control } = form;

  // Use useFormState for reactive errors subscription
  // This ensures section statuses update when validation errors change
  const { errors } = useFormState({ control });

  // Watch all values for section status calculation
  const values = useWatch({ control }) as PostFormValues;

  // Handle form submission
  const onFormSubmit = useCallback(
    (formValues: PostFormValues) => {
      const {
        title,
        description,
        propertyType,
        area,
        amenities: selectedAmenities,
        province,
        district,
        ward,
        address,
        lat,
        lng,
        price,
        deposit,
        electricityBill,
        waterBill,
        internetBill,
        otherBill,
        waterBillUnit,
        internetBillUnit,
        terms: selectedTermIds,
        images,
      } = formValues;

      // Runtime validation for required fields that may be undefined
      if (!propertyType) {
        toast.error(t("posts.form.validation.property_type_required"));
        setOpenSections((prev) =>
          prev.includes(FORM_SECTION_KEYS.BASIC_INFORMATION)
            ? prev
            : [...prev, FORM_SECTION_KEYS.BASIC_INFORMATION]
        );
        return;
      }

      if (!province || !district || !ward) {
        toast.error(t("posts.form.validation.location_required"));
        setOpenSections((prev) =>
          prev.includes(FORM_SECTION_KEYS.LOCATION)
            ? prev
            : [...prev, FORM_SECTION_KEYS.LOCATION]
        );
        return;
      }

      if (lat === undefined || lng === undefined) {
        toast.error(t("posts.form.validation.map_location_required"));
        setOpenSections((prev) =>
          prev.includes(FORM_SECTION_KEYS.LOCATION)
            ? prev
            : [...prev, FORM_SECTION_KEYS.LOCATION]
        );
        return;
      }

      const imageFiles = images
        .filter((image) => !image.isUploaded)
        .map((image) => image.file);

      const deletedImageIds = post?.postImages
        ?.filter((image) => !images.some((i) => i.id === image.id.toString()))
        ?.map((image) => image.id);

      const data: PostFormData = {
        payload: {
          title,
          description,
          propertyTypeId: propertyType.id,
          area: Number(area),
          amenityIds: selectedAmenities.map((amenity) => amenity.id),
          provinceCode: province.code,
          districtCode: district.code,
          wardCode: ward.code,
          address,
          lat,
          lng,
          price: convertCurrencyToNumber(price),
          deposit: convertCurrencyToNumber(deposit),
          electricityBill: convertCurrencyToNumber(electricityBill),
          waterBill: convertCurrencyToNumber(waterBill),
          internetBill: convertCurrencyToNumber(internetBill),
          otherBill: convertCurrencyToNumber(otherBill),
          waterBillUnit,
          internetBillUnit,
          termIds: selectedTermIds,
          deletedImageIds,
        },
        images: imageFiles,
      };

      onSubmit(data);
    },
    [onSubmit, post?.postImages]
  );

  // Calculate section statuses
  // Note: Not using useMemo because errors object reference from useFormState
  // may not change even when error content changes, preventing proper recalculation
  const sectionStatuses = {
    [FORM_SECTION_KEYS.BASIC_INFORMATION]: getSectionStatus(
      FORM_SECTION_KEYS.BASIC_INFORMATION,
      errors,
      values
    ),
    [FORM_SECTION_KEYS.LOCATION]: getSectionStatus(
      FORM_SECTION_KEYS.LOCATION,
      errors,
      values
    ),
    [FORM_SECTION_KEYS.PRICE_AND_TERMS]: getSectionStatus(
      FORM_SECTION_KEYS.PRICE_AND_TERMS,
      errors,
      values
    ),
    [FORM_SECTION_KEYS.UPLOAD_IMAGES]: getSectionStatus(
      FORM_SECTION_KEYS.UPLOAD_IMAGES,
      errors,
      values
    ),
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={handleSubmit(onFormSubmit, (errors) => {
          // Open sections with errors
          const errorsKeys = Object.keys(errors) as (keyof PostFormValues)[];
          const sectionsToOpen: string[] = [];

          for (const [sectionKey, fields] of Object.entries(SECTION_FIELDS)) {
            const sectionFields = fields as (keyof PostFormValues)[];
            if (sectionFields.some((field) => errorsKeys.includes(field))) {
              sectionsToOpen.push(sectionKey);
            }
          }

          if (sectionsToOpen.length > 0) {
            setOpenSections((prev) => [
              ...new Set([...prev, ...sectionsToOpen]),
            ]);
          }
        })}
      >
        <div className="container max-w-4xl mx-auto">
          <Accordion
            type="multiple"
            value={openSections}
            onValueChange={setOpenSections}
            className="space-y-3"
          >
            {/* Basic Information Section */}
            <FormSectionAccordion
              value={FORM_SECTION_KEYS.BASIC_INFORMATION}
              title={t(FORM_SECTIONS[0].labelKey)}
              description={t(FORM_SECTIONS[0].descriptionKey)}
              status={sectionStatuses[FORM_SECTION_KEYS.BASIC_INFORMATION]}
            >
              <BasicInformationFields
                amenities={amenities}
                propertyTypes={propertyTypes}
              />
            </FormSectionAccordion>

            {/* Location Section */}
            <FormSectionAccordion
              value={FORM_SECTION_KEYS.LOCATION}
              title={t(FORM_SECTIONS[1].labelKey)}
              description={t(FORM_SECTIONS[1].descriptionKey)}
              status={sectionStatuses[FORM_SECTION_KEYS.LOCATION]}
            >
              <LocationFields
                initialLat={defaultValues.lat}
                initialLng={defaultValues.lng}
              />
            </FormSectionAccordion>

            {/* Price & Terms Section */}
            <FormSectionAccordion
              value={FORM_SECTION_KEYS.PRICE_AND_TERMS}
              title={t(FORM_SECTIONS[2].labelKey)}
              description={t(FORM_SECTIONS[2].descriptionKey)}
              status={sectionStatuses[FORM_SECTION_KEYS.PRICE_AND_TERMS]}
            >
              <PriceAndTermsFields terms={terms} />
            </FormSectionAccordion>

            {/* Upload Images Section */}
            <FormSectionAccordion
              value={FORM_SECTION_KEYS.UPLOAD_IMAGES}
              title={t(FORM_SECTIONS[3].labelKey)}
              description={t(FORM_SECTIONS[3].descriptionKey)}
              status={sectionStatuses[FORM_SECTION_KEYS.UPLOAD_IMAGES]}
            >
              <UploadImagesFields />
            </FormSectionAccordion>
          </Accordion>

          {/* Submit Button */}
          <div className="flex justify-end mt-8">
            <Button type="submit" size="lg">
              {labelSubmit}
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
