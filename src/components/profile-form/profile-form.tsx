"use client";

import { DatePicker } from "@/components/date-picker";
import { LocationField } from "@/components/location-field";
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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ERROR_MESSAGE } from "@/constants/error-message";
import { GENDER } from "@/constants/gender";
import { USER_ROLE } from "@/constants/user-role";
import { allowOnlyNumbers } from "@/lib/input-utils";
import type { District, Province, Ward } from "@/types/location";
import { useTranslations } from "next-intl";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { useRoles } from "./profile-form-provider";

export type ProfileFormData = {
  name: string;
  gender?: (typeof GENDER)[keyof typeof GENDER];
  role?: (typeof USER_ROLE)[keyof typeof USER_ROLE];
  birthday?: Date;
  phone: string;
  province: Province | undefined;
  district: District | undefined;
  ward: Ward | undefined;
  address?: string;
};

export function ProfileForm({
  heading,
  description,
}: {
  heading?: string;
  description?: string;
}) {
  const t = useTranslations();
  const { control, register, setValue, formState, getFieldState } =
    useFormContext<ProfileFormData>();

  const province = useWatch({ control, name: "province" });
  const district = useWatch({ control, name: "district" });
  const ward = useWatch({ control, name: "ward" });

  // Get roles from context (server-fetched, passed as prop)
  const roles = useRoles();

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
              aria-invalid={getFieldState("name").invalid}
            />
            {formState.errors.name?.message && (
              <FieldError
                errors={[{ message: formState.errors.name.message }]}
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
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value={GENDER.MALE} id="male" />
                    <Label htmlFor="male">{t("profile.gender.male")}</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value={GENDER.FEMALE} id="female" />
                    <Label htmlFor="female">{t("profile.gender.female")}</Label>
                  </div>
                </RadioGroup>
              )}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="role">{t("profile.setup.role")}</FieldLabel>
            <FieldDescription>
              {t("profile.setup.role_description")}
            </FieldDescription>
            <Controller
              control={control}
              name="role"
              render={({ field: { value, onChange } }) => (
                <RadioGroup
                  className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:gap-4"
                  value={value}
                  onValueChange={onChange}
                >
                  {roles.map((role) => (
                    <div key={role.id} className="flex items-center gap-2">
                      <RadioGroupItem value={role.name} id={role.name} />
                      <Label htmlFor={role.name}>
                        {t(`profile.role.${role.name}`)}
                      </Label>
                    </div>
                  ))}
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
                  aria-invalid={getFieldState("phone").invalid}
                />
              )}
            />
            {formState.errors.phone?.message && (
              <FieldError
                errors={[{ message: formState.errors.phone.message }]}
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
                provinceInvalid={getFieldState("province").invalid}
                districtInvalid={getFieldState("district").invalid}
                wardInvalid={getFieldState("ward").invalid}
              />
              {getFieldState("province").invalid ||
                getFieldState("district").invalid ||
                (getFieldState("ward").invalid && (
                  <FieldError errors={[{ message: ERROR_MESSAGE.REQUIRED }]} />
                ))}
            </Field>
            <Field>
              <FieldLabel htmlFor="address">
                {t("profile.setup.address")}
              </FieldLabel>
              <Input
                id="address"
                placeholder={t("profile.setup.address_placeholder")}
                {...register("address")}
                aria-invalid={getFieldState("address").invalid}
              />
              {formState.errors.address?.message && (
                <FieldError
                  errors={[{ message: formState.errors.address.message }]}
                />
              )}
            </Field>
          </FieldSet>
        </FieldGroup>
      </FieldSet>
    </FieldGroup>
  );
}
