import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";

export default function PriceAndTerms() {
  const t = useTranslations();
  return (
    <FieldSet>
      <FieldLegend>
        {t("posts.create.form.pricing_and_terms.title")}
      </FieldLegend>
      <FieldDescription>
        {t("posts.create.form.pricing_and_terms.description")}
      </FieldDescription>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="title">
            {t("posts.create.form.pricing_and_terms.price")}
          </FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="price"
              placeholder={t(
                "posts.create.form.pricing_and_terms.price_placeholder"
              )}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupText>{t("common.vnd")}</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <Field>
          <div className="flex items-start gap-3">
            <Checkbox id="enable_price_negotiation" defaultChecked />
            <div className="grid gap-2">
              <Label htmlFor="enable_price_negotiation">
                {t(
                  "posts.create.form.pricing_and_terms.enable_price_negotiation_label"
                )}
              </Label>
              <p className="text-muted-foreground text-sm">
                {t(
                  "posts.create.form.pricing_and_terms.enable_price_negotiation_description"
                )}
              </p>
            </div>
          </div>
        </Field>
        <Field>
          <div className="flex items-start gap-3">
            <Checkbox id="include_utilities_fee" defaultChecked />
            <div className="grid gap-2">
              <Label htmlFor="include_utilities_fee">
                {t("posts.create.form.pricing_and_terms.include_utilities_fee")}
              </Label>
              <p className="text-muted-foreground text-sm">
                {t(
                  "posts.create.form.pricing_and_terms.include_utilities_fee_description"
                )}
              </p>
            </div>
          </div>
        </Field>
        <div className="flex flex-col sm:flex-row gap-4">
          <Field>
            <FieldLabel htmlFor="title">
              {t("posts.create.form.pricing_and_terms.deposit")}
            </FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="deposit"
                placeholder={t(
                  "posts.create.form.pricing_and_terms.deposit_placeholder"
                )}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupText>{t("common.vnd")}</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor="title">
              {t("posts.create.form.pricing_and_terms.min_lease_term_title")}
            </FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="min_lease_term"
                placeholder={t(
                  "posts.create.form.pricing_and_terms.min_lease_term_placeholder"
                )}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupText>{t("common.month")}</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </div>
      </FieldGroup>
    </FieldSet>
  );
}
