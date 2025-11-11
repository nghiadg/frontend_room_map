import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { ERROR_MESSAGE } from "@/constants/error-message";
import { allowOnlyCurrency } from "@/lib/input-utils";
import { Term } from "@/types/terms";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { Controller, useForm, useWatch } from "react-hook-form";
import z from "zod";

const schema = z.object({
  price: z.string().min(1, { message: ERROR_MESSAGE.REQUIRED }),
  deposit: z.string().min(1, { message: ERROR_MESSAGE.REQUIRED }),
  electricityBill: z.string().min(1, { message: ERROR_MESSAGE.REQUIRED }),
  waterBill: z.string().min(1, { message: ERROR_MESSAGE.REQUIRED }),
  internetBill: z.string().min(1, { message: ERROR_MESSAGE.REQUIRED }),
  otherBill: z.string().min(1, { message: ERROR_MESSAGE.REQUIRED }),
  waterBillUnit: z.enum(["month", "m3"]),
  internetBillUnit: z.enum(["month", "person"]),
  terms: z.array(z.number()),
});

export type PriceAndTermsData = z.infer<typeof schema>;

type PriceAndTermsProps = {
  onNextStep: (data: PriceAndTermsData) => void;
  onPreviousStep: () => void;
  terms: Term[];
};

export default function PriceAndTerms({
  terms,
  onNextStep,
  onPreviousStep,
}: PriceAndTermsProps) {
  const t = useTranslations();
  const { handleSubmit, setValue, control } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      price: undefined,
      waterBillUnit: "month",
      internetBillUnit: "month",
      terms: [],
    },
  });

  const waterBillUnit = useWatch({
    control,
    name: "waterBillUnit",
    exact: true,
  });
  const internetBillUnit = useWatch({
    control,
    name: "internetBillUnit",
    exact: true,
  });

  const onSubmit = (data: PriceAndTermsData) => {
    onNextStep(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field>
          <FieldLabel>{t("posts.price_and_terms.price")}</FieldLabel>
          <Controller
            control={control}
            name="price"
            render={({ field: { onChange, value }, fieldState }) => (
              <>
                <InputGroup>
                  <InputGroupInput
                    placeholder={t("posts.price_and_terms.price_placeholder")}
                    value={value}
                    onChange={(e) => allowOnlyCurrency(e, onChange)}
                    inputMode="numeric"
                    aria-invalid={fieldState.invalid ? "true" : "false"}
                  />
                  <InputGroupAddon align="inline-end">
                    <span className="text-muted-foreground text-xs">
                      {t("common.price_unit")}/{t("common.month")}
                    </span>
                  </InputGroupAddon>
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError
                    errors={[{ message: fieldState.error?.message }]}
                  />
                )}
              </>
            )}
          />
        </Field>
        <Field>
          <FieldLabel>{t("posts.price_and_terms.deposit")}</FieldLabel>
          <Controller
            control={control}
            name="deposit"
            render={({ field: { onChange, value }, fieldState }) => (
              <>
                <InputGroup>
                  <InputGroupInput
                    placeholder={t("posts.price_and_terms.deposit_placeholder")}
                    value={value}
                    onChange={(e) => allowOnlyCurrency(e, onChange)}
                    inputMode="numeric"
                    aria-invalid={fieldState.invalid ? "true" : "false"}
                  />
                  <InputGroupAddon align="inline-end">
                    <span className="text-muted-foreground text-xs">
                      {t("common.price_unit")}
                    </span>
                  </InputGroupAddon>
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError
                    errors={[{ message: fieldState.error?.message }]}
                  />
                )}
              </>
            )}
          />
        </Field>
        <FieldSet>
          <FieldLegend>{t("posts.price_and_terms.bills")}</FieldLegend>
          <FieldDescription>
            {t("posts.price_and_terms.bills_description")}
          </FieldDescription>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Field>
              <FieldLabel>
                {t("posts.price_and_terms.electricity_bill")}
              </FieldLabel>
              <Controller
                control={control}
                name="electricityBill"
                render={({ field: { onChange, value }, fieldState }) => (
                  <>
                    <InputGroup>
                      <InputGroupInput
                        placeholder={t(
                          "posts.price_and_terms.electricity_bill_placeholder"
                        )}
                        value={value}
                        onChange={(e) => allowOnlyCurrency(e, onChange)}
                        inputMode="numeric"
                        aria-invalid={fieldState.invalid ? "true" : "false"}
                      />
                      <InputGroupAddon align="inline-end">
                        <span className="text-muted-foreground text-xs">
                          {t("common.electricity_bill_unit_kwh")}
                        </span>
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError
                        errors={[{ message: fieldState.error?.message }]}
                      />
                    )}
                  </>
                )}
              />
            </Field>
            <Field>
              <FieldLabel>{t("posts.price_and_terms.water_bill")}</FieldLabel>
              <Controller
                control={control}
                name="waterBill"
                render={({ field: { onChange, value }, fieldState }) => (
                  <>
                    <InputGroup>
                      <InputGroupInput
                        placeholder={t(
                          "posts.price_and_terms.water_bill_placeholder"
                        )}
                        value={value}
                        onChange={(e) => allowOnlyCurrency(e, onChange)}
                        inputMode="numeric"
                        aria-invalid={fieldState.invalid ? "true" : "false"}
                      />
                      <InputGroupAddon align="inline-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <InputGroupButton>
                              <span className="text-muted-foreground text-xs">
                                {waterBillUnit === "month"
                                  ? t("common.water_bill_unit_month")
                                  : t("common.water_bill_unit_m3")}
                              </span>
                              <ChevronDown className="size-4" />
                            </InputGroupButton>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onSelect={() =>
                                setValue("waterBillUnit", "month")
                              }
                            >
                              {t("common.water_bill_unit_month")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={() => setValue("waterBillUnit", "m3")}
                            >
                              {t("common.water_bill_unit_m3")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError
                        errors={[{ message: fieldState.error?.message }]}
                      />
                    )}
                  </>
                )}
              />
            </Field>
            <Field>
              <FieldLabel>
                {t("posts.price_and_terms.internet_bill")}
              </FieldLabel>
              <Controller
                control={control}
                name="internetBill"
                render={({ field: { onChange, value }, fieldState }) => (
                  <>
                    <InputGroup>
                      <InputGroupInput
                        placeholder={t(
                          "posts.price_and_terms.internet_bill_placeholder"
                        )}
                        value={value}
                        onChange={(e) => allowOnlyCurrency(e, onChange)}
                        inputMode="numeric"
                        aria-invalid={fieldState.invalid ? "true" : "false"}
                      />
                      <InputGroupAddon align="inline-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <InputGroupButton>
                              <span className="text-muted-foreground text-xs">
                                {internetBillUnit === "month"
                                  ? t("common.internet_bill_unit_month")
                                  : t("common.internet_bill_unit_person")}
                              </span>
                              <ChevronDown className="size-4" />
                            </InputGroupButton>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onSelect={() =>
                                setValue("internetBillUnit", "month")
                              }
                            >
                              {t("common.internet_bill_unit_month")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={() =>
                                setValue("internetBillUnit", "person")
                              }
                            >
                              {t("common.internet_bill_unit_person")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError
                        errors={[{ message: fieldState.error?.message }]}
                      />
                    )}
                  </>
                )}
              />
            </Field>
            <Field>
              <FieldLabel>{t("posts.price_and_terms.other_bill")}</FieldLabel>
              <Controller
                control={control}
                name="otherBill"
                render={({ field: { onChange, value }, fieldState }) => (
                  <>
                    <InputGroup>
                      <InputGroupInput
                        placeholder={t(
                          "posts.price_and_terms.other_bill_placeholder"
                        )}
                        value={value}
                        onChange={(e) => allowOnlyCurrency(e, onChange)}
                        inputMode="numeric"
                        aria-invalid={fieldState.invalid ? "true" : "false"}
                      />
                      <InputGroupAddon align="inline-end">
                        <span className="text-muted-foreground text-xs">
                          {t("common.price_unit")}/{t("common.month")}
                        </span>
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError
                        errors={[{ message: fieldState.error?.message }]}
                      />
                    )}
                  </>
                )}
              />
            </Field>
          </div>
        </FieldSet>
        <FieldSet>
          <FieldLegend>{t("posts.price_and_terms.terms")}</FieldLegend>
          <FieldDescription>
            {t("posts.price_and_terms.terms_description")}
          </FieldDescription>
          <Field>
            <Controller
              control={control}
              name="terms"
              render={({ field: { onChange, value } }) => (
                <div className="flex flex-col gap-2">
                  {terms.map((term) => (
                    <div key={term.id} className="flex items-start gap-3">
                      <Checkbox
                        id={term.key}
                        checked={value?.includes(term.id)}
                        onCheckedChange={(checked: boolean) => {
                          if (checked) {
                            onChange([...value, term.id]);
                          } else {
                            onChange(
                              value?.filter((item) => item !== term.id) ?? []
                            );
                          }
                        }}
                      />
                      <div className="grid gap-2">
                        <Label htmlFor={term.key}>{term.name}</Label>
                        <p className="text-muted-foreground text-sm">
                          {term.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            />
          </Field>
        </FieldSet>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onPreviousStep} type="button">
            {t("common.back")}
          </Button>
          <Button variant="default" type="submit">
            {t("common.next")}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
