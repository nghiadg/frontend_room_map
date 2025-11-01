"use client";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup } from "@/components/ui/radio-group";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { GENDER } from "@/constants/gender";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/date-picker";
import { LocationField } from "@/components/location-field";
import { useTranslations } from "next-intl";
import {
  Controller,
  Resolver,
  useForm,
  UseFormReturn,
  useWatch,
} from "react-hook-form";
import type { Province, District, Ward } from "@/types/location";
import { allowOnlyNumbers } from "@/lib/input-utils";
import { useImperativeHandle, useMemo } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ERROR_MESSAGE } from "@/constants/error-message";

const schema = z.object({
  name: z.string().min(1, { message: ERROR_MESSAGE.REQUIRED }),
  gender: z.enum(GENDER),
  birthday: z.date().optional(),
  phone: z.string().min(1, { message: ERROR_MESSAGE.REQUIRED }),
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

export type ProfileFormData = {
  name: string;
  gender: (typeof GENDER)[keyof typeof GENDER];
  birthday: Date | undefined;
  phone: string;
  province: Province | undefined;
  district: District | undefined;
  ward: Ward | undefined;
};

export function ProfileForm({
  ref,
  heading,
  description,
}: {
  ref: React.RefObject<{
    form: UseFormReturn<ProfileFormData, unknown, ProfileFormData>;
  } | null>;
  heading?: string;
  description?: string;
}) {
  const t = useTranslations();
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(schema) as unknown as Resolver<ProfileFormData>,
    defaultValues: {
      name: "",
      gender: GENDER.MALE,
      birthday: undefined,
      phone: "",
      province: undefined,
      district: undefined,
      ward: undefined,
    },
  });

  const { register, control, setValue } = form;
  const province = useWatch({ control, name: "province" });
  const district = useWatch({ control, name: "district" });
  const ward = useWatch({ control, name: "ward" });

  useImperativeHandle(ref, () => ({
    form,
  }));

  const locationFieldInvalid = useMemo(() => {
    return (
      form.formState.errors.province?.message ||
      form.formState.errors.district?.message ||
      form.formState.errors.ward?.message
    );
  }, [
    form.formState.errors.province,
    form.formState.errors.district,
    form.formState.errors.ward,
  ]);

  return (
    <FieldGroup>
      <FieldSet>
        <FieldLegend>{heading || t("profile.setup.title")}</FieldLegend>
        <FieldDescription>
          {description || t("profile.setup.description")}
        </FieldDescription>
        <FieldGroup className="gap-4">
          <Field>
            <FieldLabel htmlFor="name">{t("profile.setup.name")}</FieldLabel>
            <Input
              id="name"
              placeholder={t("profile.setup.name_placeholder")}
              {...register("name")}
              aria-invalid={form.getFieldState("name").invalid}
            />
            {form.formState.errors.name?.message && (
              <FieldError
                errors={[{ message: form.formState.errors.name.message }]}
              />
            )}
          </Field>
          <Field>
            <FieldLabel htmlFor="gender">
              {t("profile.setup.gender")}
            </FieldLabel>
            <Controller
              control={control}
              name="gender"
              render={({ field: { value, onChange } }) => (
                <RadioGroup
                  className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:gap-4"
                  value={value}
                  onValueChange={onChange}
                >
                  <div className="flex items-center gap-2 rounded-lg border p-3">
                    <RadioGroupItem value={GENDER.MALE} id="male" />
                    <Label htmlFor="male">{t("profile.gender.male")}</Label>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg border p-3">
                    <RadioGroupItem value={GENDER.FEMALE} id="female" />
                    <Label htmlFor="female">{t("profile.gender.female")}</Label>
                  </div>
                </RadioGroup>
              )}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="birthday">
              {t("profile.setup.birthday")}
            </FieldLabel>
            <Controller
              control={control}
              name="birthday"
              render={({ field: { value, onChange } }) => (
                <DatePicker.Single
                  selected={value}
                  onSelect={onChange}
                  placeholder={t("profile.setup.birthday_placeholder")}
                  captionLayout="dropdown"
                />
              )}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="phone">{t("profile.setup.phone")}</FieldLabel>
            <Controller
              control={control}
              name="phone"
              render={({ field: { value, onChange } }) => (
                <Input
                  id="phone"
                  placeholder={t("profile.setup.phone_placeholder")}
                  value={value}
                  onChange={(e) => {
                    allowOnlyNumbers(e, onChange);
                  }}
                  inputMode="numeric"
                  pattern="\d*"
                  aria-invalid={form.getFieldState("phone").invalid}
                />
              )}
            />
            {form.formState.errors.phone?.message && (
              <FieldError
                errors={[{ message: form.formState.errors.phone.message }]}
              />
            )}
          </Field>
          <FieldSet className="gap-4">
            <FieldLegend>{t("profile.setup.location")}</FieldLegend>
            <FieldDescription>
              {t("profile.setup.location_description")}
            </FieldDescription>
            <Field>
              <LocationField
                province={province}
                setProvince={(province) => {
                  setValue("province", province);
                }}
                district={district}
                setDistrict={(district) => {
                  setValue("district", district);
                }}
                ward={ward}
                setWard={(ward) => {
                  setValue("ward", ward);
                }}
                provinceInvalid={form.getFieldState("province").invalid}
                districtInvalid={form.getFieldState("district").invalid}
                wardInvalid={form.getFieldState("ward").invalid}
              />
              {locationFieldInvalid && (
                <FieldError errors={[{ message: ERROR_MESSAGE.REQUIRED }]} />
              )}
            </Field>
          </FieldSet>
        </FieldGroup>
      </FieldSet>
    </FieldGroup>
  );
}
