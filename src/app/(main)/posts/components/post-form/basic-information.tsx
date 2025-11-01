import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MapPinIcon } from "lucide-react";
import { LocationField } from "@/components/location-field";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useFormContext, useWatch } from "react-hook-form";
import { PostFormData } from "@/types/post";

export default function BasicInformation() {
  const { control, setValue } = useFormContext<PostFormData>();
  const province = useWatch({ control, name: "province" });
  const district = useWatch({ control, name: "district" });
  const ward = useWatch({ control, name: "ward" });

  const t = useTranslations();
  return (
    <FieldSet>
      <FieldLegend>{t("posts.create.form.basic_details.title")}</FieldLegend>
      <FieldDescription>
        {t("posts.create.form.basic_details.description")}
      </FieldDescription>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="title">
            {t("posts.create.form.basic_details.property_type")}
          </FieldLabel>
          <Select>
            <SelectTrigger>
              <SelectValue
                placeholder={t(
                  "posts.create.form.basic_details.property_type_placeholder"
                )}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Chung cư mini</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel htmlFor="title">
            {t("posts.create.form.basic_details.location")}
          </FieldLabel>
          <LocationField
            province={province}
            district={district}
            ward={ward}
            setProvince={(province) => {
              setValue("province", province);
            }}
            setDistrict={(district) => {
              setValue("district", district);
            }}
            setWard={(ward) => {
              setValue("ward", ward);
            }}
            provinceInvalid={false}
            districtInvalid={false}
            wardInvalid={false}
          />
          <Field>
            <FieldLabel htmlFor="title">
              {t("posts.create.form.basic_details.address")}
            </FieldLabel>
            <Input
              id="address"
              placeholder={t(
                "posts.create.form.basic_details.address_placeholder"
              )}
            />
          </Field>
          <Field>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:justify-between">
              <FieldLabel htmlFor="title">
                {t("posts.create.form.basic_details.map")}
              </FieldLabel>
              <Button
                variant="secondary"
                size="sm"
                type="button"
                className="w-full sm:w-auto"
              >
                <MapPinIcon className="size-4" />
                {t("common.update")}
              </Button>
            </div>

            <div className="h-[200px] md:h-[250px] lg:h-[200px] border border-gray-200 rounded-md overflow-hidden">
              <Image
                src="https://media.wired.com/photos/59269cd37034dc5f91bec0f1/191:100/w_1280,c_limit/GoogleMapTA.jpg"
                alt="map"
                className="w-full h-full object-cover"
                loading="lazy"
                height={200}
                width={200}
              />
            </div>
          </Field>
        </Field>
      </FieldGroup>
    </FieldSet>
  );
}
