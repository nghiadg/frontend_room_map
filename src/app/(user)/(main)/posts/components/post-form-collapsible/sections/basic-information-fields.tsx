"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { AMENITIES_ICON_MAP } from "@/constants/amenities";
import { PROPERTY_TYPES_ICON_MAP } from "@/constants/property-types";
import { allowOnlyNumbers } from "@/lib/input-utils";
import { Amenity } from "@/types/amenities";
import { PropertyType } from "@/types/property-types";
import { useTranslations } from "next-intl";
import { memo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { PostFormValues } from "../schema";

type BasicInformationFieldsProps = {
  amenities: Amenity[];
  propertyTypes: PropertyType[];
};

function BasicInformationFieldsComponent({
  amenities,
  propertyTypes,
}: BasicInformationFieldsProps) {
  const t = useTranslations();
  const { control } = useFormContext<PostFormValues>();

  return (
    <FieldGroup>
      <Field>
        <FieldLabel>{t("posts.basic_information.title")}</FieldLabel>
        <Controller
          control={control}
          name="title"
          render={({ field, fieldState }) => (
            <>
              <Input
                maxLength={100}
                placeholder={t("posts.basic_information.title_placeholder")}
                {...field}
                aria-invalid={fieldState.invalid ? "true" : "false"}
              />
              {fieldState.invalid && (
                <FieldError errors={[{ message: fieldState.error?.message }]} />
              )}
            </>
          )}
        />
      </Field>

      <Field>
        <FieldLabel>{t("posts.basic_information.description")}</FieldLabel>
        <Controller
          control={control}
          name="description"
          render={({ field, fieldState }) => (
            <>
              <Textarea
                className="min-h-[120px] resize-none"
                placeholder={t(
                  "posts.basic_information.description_placeholder"
                )}
                {...field}
                aria-invalid={fieldState.invalid ? "true" : "false"}
              />
              {fieldState.invalid && (
                <FieldError errors={[{ message: fieldState.error?.message }]} />
              )}
            </>
          )}
        />
      </Field>

      <Field>
        <FieldLabel>{t("posts.basic_information.property_type")}</FieldLabel>
        <Controller
          control={control}
          name="propertyType"
          render={({ field: { onChange, value }, fieldState }) => (
            <>
              <RadioGroup
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2"
                value={value?.key}
                onValueChange={(value: string) => {
                  onChange(
                    propertyTypes.find(
                      (propertyType) => propertyType.key === value
                    ) ?? undefined
                  );
                }}
              >
                {propertyTypes.map((propertyType) => {
                  const Icon = PROPERTY_TYPES_ICON_MAP[propertyType.key];
                  return (
                    <Label
                      key={propertyType.id}
                      className="
                        group py-4 cursor-pointer border rounded-lg 
                        flex flex-col items-center justify-center 
                        transition-colors duration-150 text-muted-foreground 
                        focus-within:border-primary 
                        has-[[aria-checked=true]]:bg-primary/5 
                        has-[[aria-checked=true]]:text-primary 
                        has-[[aria-checked=true]]:border-primary/20
                      "
                    >
                      <RadioGroupItem
                        value={propertyType.key}
                        className="hidden"
                      />
                      <div className="flex flex-col items-center gap-2">
                        {Icon && <Icon className="size-4" aria-hidden="true" />}
                        <p className="text-center text-xs">
                          {propertyType.name}
                        </p>
                      </div>
                    </Label>
                  );
                })}
              </RadioGroup>
              {fieldState.invalid && (
                <FieldError errors={[{ message: fieldState.error?.message }]} />
              )}
            </>
          )}
        />
      </Field>

      <Field>
        <FieldLabel>{t("posts.basic_information.area")}</FieldLabel>
        <Controller
          control={control}
          name="area"
          render={({ field: { onChange, value }, fieldState }) => (
            <>
              <InputGroup>
                <InputGroupInput
                  placeholder={t("posts.basic_information.area_placeholder")}
                  value={value as string}
                  onChange={(e) => allowOnlyNumbers(e, onChange)}
                  inputMode="numeric"
                  aria-invalid={fieldState.invalid ? "true" : "false"}
                />
                <InputGroupAddon align="inline-end">
                  <span className="text-muted-foreground text-xs">
                    {t("posts.basic_information.area_unit")}
                  </span>
                </InputGroupAddon>
              </InputGroup>
              {fieldState.invalid && (
                <FieldError errors={[{ message: fieldState.error?.message }]} />
              )}
            </>
          )}
        />
      </Field>

      <Field>
        <FieldLabel>{t("posts.basic_information.amenities")}</FieldLabel>
        <FieldDescription>
          {t("posts.basic_information.amenities_description")}
        </FieldDescription>
        <Controller
          control={control}
          name="amenities"
          render={({ field: { onChange, value }, fieldState }) => (
            <>
              <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                {amenities.map((amenity) => {
                  const Icon = AMENITIES_ICON_MAP[amenity.key];
                  return (
                    <li key={amenity.id}>
                      <Label
                        className="
                          group py-4 cursor-pointer border rounded-lg 
                          flex flex-col items-center justify-center 
                          transition-colors duration-150 text-muted-foreground 
                          focus-within:border-primary 
                          has-[[aria-checked=true]]:bg-primary/5 
                          has-[[aria-checked=true]]:text-primary 
                          has-[[aria-checked=true]]:border-primary/20
                        "
                      >
                        <Checkbox
                          className="hidden"
                          checked={value?.some(
                            (item) => item.id === amenity.id
                          )}
                          onCheckedChange={(checked: boolean) => {
                            if (checked) {
                              onChange([...value, amenity]);
                            } else {
                              onChange(
                                value?.filter(
                                  (item) => item.id !== amenity.id
                                ) ?? []
                              );
                            }
                          }}
                        />
                        <div className="flex flex-col items-center gap-2">
                          {Icon && (
                            <Icon className="size-4" aria-hidden="true" />
                          )}
                          <p className="text-center text-xs">{amenity.name}</p>
                        </div>
                      </Label>
                    </li>
                  );
                })}
              </ul>
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

export const BasicInformationFields = memo(BasicInformationFieldsComponent);
