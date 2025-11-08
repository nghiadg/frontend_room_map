import { Button } from "@/components/ui/button";
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
import { ERROR_MESSAGE } from "@/constants/error-message";
import { PROPERTY_TYPES_ICON_MAP } from "@/constants/property-types";
import { Amenity } from "@/types/amenities";
import { PropertyType } from "@/types/property-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  title: z
    .string()
    .min(1, { message: ERROR_MESSAGE.REQUIRED })
    .max(100, { message: ERROR_MESSAGE.MAX_LENGTH(100) }),
  description: z
    .string()
    .min(1, { message: ERROR_MESSAGE.REQUIRED })
    .max(3000, { message: ERROR_MESSAGE.MAX_LENGTH(3000) }),
  propertyType: z.any().refine((value) => value !== undefined, {
    message: ERROR_MESSAGE.REQUIRED,
  }),
  area: z.coerce
    .number({ message: ERROR_MESSAGE.MUST_BE_NUMBER })
    .min(1, { message: ERROR_MESSAGE.REQUIRED })
    .optional(),
  amenities: z.array(z.any()).min(1, { message: ERROR_MESSAGE.REQUIRED }),
});

export type BasicInformationData = z.infer<typeof schema>;

type BasicInformationProps = {
  amenities: Amenity[];
  propertyTypes: PropertyType[];
  onNextStep: (data: BasicInformationData) => void;
};

export default function BasicInformation({
  amenities,
  propertyTypes,
  onNextStep,
}: BasicInformationProps) {
  const t = useTranslations();
  const { register, handleSubmit, formState, control, getValues } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      propertyType: undefined,
      area: undefined,
      amenities: [],
    },
  });

  const onSubmit = (data: BasicInformationData) => {
    onNextStep(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field>
          <FieldLabel>{t("posts.basic_information.title")}</FieldLabel>
          <Input
            maxLength={100}
            placeholder={t("posts.basic_information.title_placeholder")}
            {...register("title")}
            aria-invalid={formState.errors.title?.message ? "true" : "false"}
          />
          {formState.errors.title?.message && (
            <FieldError
              errors={[{ message: formState.errors.title.message }]}
            />
          )}
        </Field>
        <Field>
          <FieldLabel>{t("posts.basic_information.description")}</FieldLabel>
          <Textarea
            className="min-h-[120px] resize-none"
            placeholder={t("posts.basic_information.description_placeholder")}
            {...register("description")}
            aria-invalid={
              formState.errors.description?.message ? "true" : "false"
            }
          />
          {formState.errors.description?.message && (
            <FieldError
              errors={[{ message: formState.errors.description.message }]}
            />
          )}
        </Field>
        <Field>
          <FieldLabel>{t("posts.basic_information.property_type")}</FieldLabel>
          <Controller
            control={control}
            name="propertyType"
            render={({ field: { onChange, value } }) => (
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
            )}
          />

          {typeof formState.errors.propertyType?.message === "string" && (
            <FieldError
              errors={[{ message: formState.errors.propertyType.message }]}
            />
          )}
        </Field>
        <Field>
          <FieldLabel>{t("posts.basic_information.area")}</FieldLabel>
          <InputGroup>
            <InputGroupInput
              placeholder={t("posts.basic_information.area_placeholder")}
              {...register("area")}
              aria-invalid={formState.errors.area?.message ? "true" : "false"}
            />
            <InputGroupAddon align="inline-end">
              <span className="text-muted-foreground text-xs">
                {t("posts.basic_information.area_unit")}
              </span>
            </InputGroupAddon>
          </InputGroup>
          {formState.errors.area?.message && (
            <FieldError errors={[{ message: formState.errors.area.message }]} />
          )}
        </Field>
        <Field>
          <FieldLabel>{t("posts.basic_information.amenities")}</FieldLabel>
          <FieldDescription>
            {t("posts.basic_information.amenities_description")}
          </FieldDescription>
          <Controller
            control={control}
            name="amenities"
            render={({ field: { onChange, value } }) => (
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
            )}
          />

          {formState.errors.amenities?.message && (
            <FieldError
              errors={[{ message: formState.errors.amenities.message }]}
            />
          )}
        </Field>
        <div className="flex justify-end gap-2">
          <Button
            type="submit"
            variant="default"
            disabled={
              formState.isSubmitting ||
              formState.isValidating ||
              (!formState.isValid && formState.isSubmitted)
            }
          >
            {t("common.next")}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
