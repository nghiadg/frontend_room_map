import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupText,
} from "@/components/ui/input-group";
import { useTranslations } from "next-intl";

export default function PropertyDetails() {
  const t = useTranslations();
  return (
    <FieldSet>
      <FieldLegend>{t("posts.create.form.property_details.title")}</FieldLegend>
      <FieldDescription>
        {t("posts.create.form.property_details.description")}
      </FieldDescription>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="title">
            {t("posts.create.form.property_details.area_title")}
          </FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="area"
              placeholder={t(
                "posts.create.form.property_details.area_placeholder"
              )}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupText>{t("common.m2")}</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="title">
              {t("posts.create.form.property_details.bedroom_title")}
            </FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="bedroom"
                placeholder={t(
                  "posts.create.form.property_details.bedroom_placeholder"
                )}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupText>{t("common.room")}</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor="title">
              {t("posts.create.form.property_details.bathroom_title")}
            </FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="bathroom"
                placeholder={t(
                  "posts.create.form.property_details.bathroom_placeholder"
                )}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupText>{t("common.room")}</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor="title">
              {t("posts.create.form.property_details.kitchen_title")}
            </FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="kitchen"
                placeholder={t(
                  "posts.create.form.property_details.kitchen_placeholder"
                )}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupText>{t("common.room")}</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor="title">
              {t("posts.create.form.property_details.living_room_title")}
            </FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="living_room"
                placeholder={t(
                  "posts.create.form.property_details.living_room_placeholder"
                )}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupText>{t("common.room")}</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </FieldGroup>
      </FieldGroup>
    </FieldSet>
  );
}
