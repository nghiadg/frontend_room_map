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
import { Province, District, Ward } from "@/types/location";
import { getDistricts, getWards } from "@/services/provinces";
import { QUERY_KEYS } from "@/constants/query-keys";
import { useQuery } from "@tanstack/react-query";

type LocationFieldProps = {
  province: Province | undefined;
  setProvince: (province: Province | undefined) => void;
  district: District | undefined;
  setDistrict: (district: District | undefined) => void;
  ward: Ward | undefined;
  setWard: (ward: Ward | undefined) => void;
  provinceInvalid: boolean;
  districtInvalid: boolean;
  wardInvalid: boolean;
};

export function LocationField({
  province,
  setProvince,
  district,
  setDistrict,
  ward,
  setWard,
  provinceInvalid,
  districtInvalid,
  wardInvalid,
}: LocationFieldProps) {
  const t = useTranslations();
  const { provinces } = useLocation();

  const { data: districts } = useQuery({
    queryKey: QUERY_KEYS.DISTRICTS(province?.code ?? ""),
    queryFn: () => getDistricts(province?.code ?? ""),
    enabled: !!province?.code,
    initialData: [],
  });

  const { data: wards } = useQuery({
    queryKey: QUERY_KEYS.WARDS(district?.code ?? ""),
    queryFn: () => getWards(district?.code ?? ""),
    enabled: !!district?.code,
    initialData: [],
  });

  const handleProvinceChange = (value: string) => {
    setProvince(provinces.find((c) => c.code === value));
    setDistrict(undefined);
    setWard(undefined);
  };

  const handleDistrictChange = (value: string) => {
    setDistrict(districts?.find((d) => d.code === value));
    setWard(undefined);
  };

  const handleWardChange = (value: string) => {
    setWard(wards.find((w) => w.code === value));
  };

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
      <Field>
        <FieldLabel htmlFor="city">{t("location.city")}</FieldLabel>
        <Select
          value={province?.code ?? ""}
          onValueChange={handleProvinceChange}
        >
          <SelectTrigger
            aria-invalid={provinceInvalid}
            className="aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
          >
            <SelectValue placeholder={t("location.city_placeholder")} />
          </SelectTrigger>
          <SelectContent>
            {provinces.length > 0 ? (
              provinces.map((province) => (
                <SelectItem key={province.code} value={province.code}>
                  {province.name}
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
        <FieldLabel htmlFor="district">{t("location.district")}</FieldLabel>
        <Select
          value={district?.code ?? ""}
          onValueChange={handleDistrictChange}
        >
          <SelectTrigger
            aria-invalid={districtInvalid}
            className="aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
          >
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
        <FieldLabel htmlFor="ward">{t("location.ward")}</FieldLabel>
        <Select value={ward?.code ?? ""} onValueChange={handleWardChange}>
          <SelectTrigger
            aria-invalid={wardInvalid}
            className="aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
          >
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
