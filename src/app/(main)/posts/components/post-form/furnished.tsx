import { FieldSet } from "@/components/ui/field";
import { FieldLegend } from "@/components/ui/field";
import { FieldDescription } from "@/components/ui/field";
import { FieldGroup } from "@/components/ui/field";
import { Field } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { FURNISHED_FAKE_DATA } from "@/constants/fake_data";

export default function Furnished() {
  const t = useTranslations();
  return (
    <FieldSet>
      <FieldLegend>{t("posts.create.form.furnished.title")}</FieldLegend>
      <FieldDescription>
        {t("posts.create.form.furnished.description")}
      </FieldDescription>
      <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {FURNISHED_FAKE_DATA.map((item) => (
          <Field key={item.value}>
            <div className="flex items-start gap-3">
              <Checkbox id="furnished" defaultChecked />
              <div className="grid gap-2">
                <Label htmlFor="enable_price_negotiation">{item.label}</Label>
              </div>
            </div>
          </Field>
        ))}
      </FieldGroup>
    </FieldSet>
  );
}
