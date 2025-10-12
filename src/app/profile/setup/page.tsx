"use client";

import { DatePicker } from "@/components/date-picker";
import { LocationField } from "@/components/location-field";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { GENDER } from "@/constants/gender";
import { useTranslations } from "next-intl";

export default function ProfileSetupPage() {
  const t = useTranslations();
  return (
    <div className="flex justify-center items-center min-h-screen">
      <form className="min-w-sm max-w-md flex-shrink-0">
        <FieldGroup>
          <FieldSet>
            <FieldLegend>{t("profile.setup.title")}</FieldLegend>
            <FieldDescription>
              {t("profile.setup.description")}
            </FieldDescription>
            <FieldGroup className="gap-3">
              <Field>
                <FieldLabel htmlFor="name">
                  {t("profile.setup.name")}
                </FieldLabel>
                <Input
                  id="name"
                  placeholder={t("profile.setup.name_placeholder")}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="gender">
                  {t("profile.setup.gender")}
                </FieldLabel>
                <RadioGroup className="flex gap-3">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value={GENDER.MALE} id="male" />
                    <Label htmlFor="male">{t("profile.gender.male")}</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value={GENDER.FEMALE} id="female" />
                    <Label htmlFor="female">{t("profile.gender.female")}</Label>
                  </div>
                </RadioGroup>
              </Field>
              <Field>
                <FieldLabel htmlFor="birthday">
                  {t("profile.setup.birthday")}
                </FieldLabel>
                <DatePicker.Single
                  placeholder={t("profile.setup.birthday_placeholder")}
                  captionLayout="dropdown"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="phone">
                  {t("profile.setup.phone")}
                </FieldLabel>
                <Input
                  id="phone"
                  placeholder={t("profile.setup.phone_placeholder")}
                  required
                />
              </Field>
              <FieldSet>
                <FieldLegend>{t("profile.setup.location")}</FieldLegend>
                <FieldDescription>
                  {t("profile.setup.location_description")}
                </FieldDescription>
                <LocationField
                  city={undefined}
                  setCity={() => {}}
                  district={undefined}
                  setDistrict={() => {}}
                  ward={undefined}
                  setWard={() => {}}
                />
              </FieldSet>
            </FieldGroup>
          </FieldSet>
          <Field>
            <Button type="submit">{t("profile.setup.submit")}</Button>
            <Button type="button" variant="outline">
              {t("common.cancel")}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
