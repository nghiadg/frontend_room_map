"use client";

import { Field, FieldLabel } from "@/components/ui/field";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocation } from "@/hooks/useLocation";
import { City, District, Ward } from "@/types/location";
import { useState } from "react";

type LocationFieldProps = {
  city: City | undefined;
  setCity: (city: City | undefined) => void;
  district: District | undefined;
  setDistrict: (district: District | undefined) => void;
  ward: Ward | undefined;
  setWard: (ward: Ward | undefined) => void;
};

export function LocationField({
  city,
  setCity,
  district,
  setDistrict,
  ward,
  setWard,
}: LocationFieldProps) {
  const t = useTranslations();
  const { cities } = useLocation();

  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const handleCityChange = (value: string) => {
    // TODO: get districts by city
    setDistricts([]);
    setWards([]);
    setCity(cities.find((c) => c.code === value));
    setDistrict(undefined);
    setWard(undefined);
  };

  const handleDistrictChange = (value: string) => {
    // TODO: get wards by district
    setWards([]);
    setDistrict(districts.find((d) => d.code === value));
    setWard(undefined);
  };

  const handleWardChange = (value: string) => {
    setWard(wards.find((w) => w.code === value));
  };

  return (
    <div className="grid grid-cols-3 gap-3">
      <Field>
        <FieldLabel htmlFor="city">{t("location.city")}</FieldLabel>
        <Select value={city?.code} onValueChange={handleCityChange}>
          <SelectTrigger>
            <SelectValue placeholder={t("location.city_placeholder")} />
          </SelectTrigger>
          <SelectContent>
            {cities.length > 0 ? (
              cities.map((city) => (
                <SelectItem key={city.code} value={city.code}>
                  {city.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="none" disabled>
                {t("select_no_data")}
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </Field>
      <Field>
        <FieldLabel htmlFor="province">{t("location.district")}</FieldLabel>
        <Select value={district?.code} onValueChange={handleDistrictChange}>
          <SelectTrigger>
            <SelectValue placeholder={t("location.district_placeholder")} />
          </SelectTrigger>
          <SelectContent>
            {districts.length > 0 ? (
              districts.map((district) => (
                <SelectItem key={district.code} value={district.code}>
                  {district.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="none" disabled>
                {t("select_no_data")}
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </Field>
      <Field>
        <FieldLabel htmlFor="province">{t("location.ward")}</FieldLabel>
        <Select value={ward?.code} onValueChange={handleWardChange}>
          <SelectTrigger>
            <SelectValue placeholder={t("location.ward_placeholder")} />
          </SelectTrigger>
          <SelectContent>
            {wards.length > 0 ? (
              wards.map((ward) => (
                <SelectItem key={ward.code} value={ward.code}>
                  {ward.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="none" disabled>
                {t("select_no_data")}
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </Field>
    </div>
  );
}
