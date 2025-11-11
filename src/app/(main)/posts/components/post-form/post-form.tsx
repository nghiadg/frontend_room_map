"use client";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Amenity } from "@/types/amenities";
import { ChevronRightIcon } from "lucide-react";
import React, { useRef, useState } from "react";
import BasicInformation, { BasicInformationData } from "./basic-information";
import { POST_STEPS, POST_STEPS_KEYS } from "./post-form.consts";
import { PropertyType } from "@/types/property-types";
import Location, { LocationData } from "./location";
import PriceAndTerms, { PriceAndTermsData } from "./price-and-terms";
import { Term } from "@/types/terms";
import UploadImages, { UploadImagesData } from "./upload-images";
import { cn } from "@/lib/utils";
import { CreatePostData } from "@/services/types/posts";
import { convertCurrencyToNumber } from "@/lib/input-utils";

type PostFormProps = {
  amenities: Amenity[];
  propertyTypes: PropertyType[];
  terms: Term[];
  onSubmit: (data: CreatePostData) => void;
};

export default function PostForm({
  amenities,
  propertyTypes,
  terms,
  onSubmit,
}: PostFormProps) {
  const [currentStep, setCurrentStep] = useState(
    POST_STEPS_KEYS.BASIC_INFORMATION
  );
  const basicInformationDataRef = useRef<BasicInformationData | null>(null);
  const locationDataRef = useRef<LocationData | null>(null);
  const priceAndTermsDataRef = useRef<PriceAndTermsData | null>(null);
  const uploadImagesDataRef = useRef<UploadImagesData | null>(null);

  const onNextStep = () => {
    setCurrentStep(
      POST_STEPS[POST_STEPS.findIndex((step) => step.key === currentStep) + 1]
        .key
    );
    scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const onPreviousStep = () => {
    setCurrentStep(
      POST_STEPS[POST_STEPS.findIndex((step) => step.key === currentStep) - 1]
        .key
    );
    scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const onSubmitForm = () => {
    if (
      !basicInformationDataRef.current ||
      !locationDataRef.current ||
      !priceAndTermsDataRef.current ||
      !uploadImagesDataRef.current
    ) {
      return;
    }
    const { title, description, propertyType, area, amenities } =
      basicInformationDataRef.current;
    const { province, district, ward, address, lat, lng } =
      locationDataRef.current;
    const {
      price,
      deposit,
      electricityBill,
      waterBill,
      internetBill,
      otherBill,
      waterBillUnit,
      internetBillUnit,
    } = priceAndTermsDataRef.current;
    const { images } = uploadImagesDataRef.current || [];

    const data: CreatePostData = {
      payload: {
        title,
        description,
        propertyTypeId: propertyType.id,
        area: Number(area),
        amenityIds: amenities.map((amenity) => amenity.id),
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
        termIds: terms.map((term) => term.id),
      },
      images: images.map((image) => image.file),
    };
    onSubmit(data);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        {POST_STEPS.map((step, index) => (
          <React.Fragment key={step.key}>
            <div
              className={cn("items-center gap-2 hidden lg:flex", {
                flex: step.key === currentStep,
              })}
            >
              <div
                className={cn(
                  "w-9 h-9 rounded-full flex items-center bg-gray-200 text-gray-500 justify-center font-semibold",
                  {
                    "bg-primary text-white": currentStep === step.key,
                    "bg-green-400 text-white": currentStep > step.key,
                  }
                )}
              >
                {step.step}
              </div>
              <div>
                <div className="text-sm font-medium">{step.label}</div>
                <div className="text-xs text-muted-foreground">
                  {step.description}
                </div>
              </div>
            </div>
            {index < POST_STEPS.length - 1 && (
              <ChevronRightIcon className="hidden lg:block text-primary size-5" />
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="container max-w-4xl mx-auto">
        <Tabs className="mt-10" value={currentStep}>
          <TabsContent
            value={POST_STEPS_KEYS.BASIC_INFORMATION}
            forceMount
            hidden={currentStep !== POST_STEPS_KEYS.BASIC_INFORMATION}
          >
            <BasicInformation
              amenities={amenities}
              propertyTypes={propertyTypes}
              onNextStep={(data) => {
                basicInformationDataRef.current = data;
                onNextStep();
              }}
            />
          </TabsContent>
          <TabsContent
            value={POST_STEPS_KEYS.LOCATION}
            forceMount
            hidden={currentStep !== POST_STEPS_KEYS.LOCATION}
          >
            <Location
              onNextStep={(data) => {
                locationDataRef.current = data;
                onNextStep();
              }}
              onPreviousStep={onPreviousStep}
            />
          </TabsContent>
          <TabsContent
            value={POST_STEPS_KEYS.PRICE_AND_TERMS}
            forceMount
            hidden={currentStep !== POST_STEPS_KEYS.PRICE_AND_TERMS}
          >
            <PriceAndTerms
              terms={terms}
              onNextStep={(data) => {
                priceAndTermsDataRef.current = data;
                onNextStep();
              }}
              onPreviousStep={onPreviousStep}
            />
          </TabsContent>
          <TabsContent
            value={POST_STEPS_KEYS.UPLOAD_IMAGES}
            forceMount
            hidden={currentStep !== POST_STEPS_KEYS.UPLOAD_IMAGES}
          >
            <UploadImages
              onPreviousStep={onPreviousStep}
              onSubmit={(data) => {
                uploadImagesDataRef.current = data;
                onSubmitForm();
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
