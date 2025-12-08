import { formatPrice } from "@/lib/utils";
import {
  BanknoteIcon,
  GlobeIcon,
  LucideIcon,
  PlugZapIcon,
  ReceiptTextIcon,
  WavesIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

type FeesListProps = {
  deposit: number;
  electricityBill: number;
  waterBill: number;
  internetBill: number;
  otherBill: number;
  waterBillUnit: "month" | "m3";
  internetBillUnit: "month" | "person";
  variant?: "card" | "mobile";
};

type FeeItem = {
  label: string;
  value: string;
  rawValue: number;
  unit: string;
  isFirst?: boolean; // Used for border separator only
  icon: LucideIcon;
};

export function useFeesList({
  deposit,
  electricityBill,
  waterBill,
  internetBill,
  otherBill,
  waterBillUnit,
  internetBillUnit,
}: Omit<FeesListProps, "variant">): FeeItem[] {
  const t = useTranslations();

  return useMemo(
    () => [
      {
        label: t("posts.booking.deposit"),
        value: formatPrice(deposit),
        rawValue: deposit,
        unit: t("common.price_unit"),
        isFirst: true,
        icon: BanknoteIcon,
      },
      {
        label: t("posts.booking.electricity_bill"),
        value: formatPrice(electricityBill),
        rawValue: electricityBill,
        unit: t("common.electricity_bill_unit_kwh"),
        icon: PlugZapIcon,
      },
      {
        label: t("posts.booking.water_bill"),
        value: formatPrice(waterBill),
        rawValue: waterBill,
        unit:
          waterBillUnit === "month"
            ? t("common.water_bill_unit_month")
            : t("common.water_bill_unit_m3"),
        icon: WavesIcon,
      },
      {
        label: t("posts.booking.internet_bill"),
        value: formatPrice(internetBill),
        rawValue: internetBill,
        unit:
          internetBillUnit === "month"
            ? t("common.internet_bill_unit_month")
            : t("common.internet_bill_unit_person"),
        icon: GlobeIcon,
      },
      {
        label: t("posts.booking.other_bill"),
        value: formatPrice(otherBill),
        rawValue: otherBill,
        unit: t("common.price_unit") + "/" + t("common.month"),
        icon: ReceiptTextIcon,
      },
    ],
    [
      deposit,
      electricityBill,
      t,
      waterBill,
      waterBillUnit,
      internetBill,
      internetBillUnit,
      otherBill,
    ]
  );
}

export default function FeesList({
  variant = "card",
  ...props
}: FeesListProps) {
  const fees = useFeesList(props);
  const t = useTranslations();

  if (variant === "mobile") {
    return (
      <div className="flex flex-col gap-2">
        {fees.map((fee) => (
          <div
            key={fee.label}
            className="flex items-center justify-between px-4 py-3 rounded-lg bg-muted"
          >
            <div className="flex items-center gap-2">
              <fee.icon className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium text-sm text-muted-foreground">
                {fee.label}
              </span>
            </div>
            <span className="font-semibold text-base">
              {fee.rawValue === 0 ? (
                <span className="text-green-600">
                  {t("posts.booking.free")}
                </span>
              ) : (
                <>
                  {fee.value}
                  <span className="text-muted-foreground font-normal ml-0.5 text-sm">
                    {fee.unit}
                  </span>
                </>
              )}
            </span>
          </div>
        ))}
      </div>
    );
  }

  // Card variant - Clean Airbnb-style design
  return (
    <div className="space-y-0">
      {fees.map((fee, index) => (
        <div
          key={fee.label}
          className={`flex items-center justify-between py-3 ${
            fee.isFirst ? "pb-4 mb-2 border-b-2 border-muted" : ""
          } ${
            !fee.isFirst && index !== fees.length - 1
              ? "border-b border-muted"
              : ""
          }`}
        >
          <div className="flex items-center gap-2">
            <fee.icon className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{fee.label}</span>
          </div>
          <span className="font-medium text-sm">
            {fee.rawValue === 0 ? (
              <span className="text-green-600 font-medium">
                {t("posts.booking.free")}
              </span>
            ) : (
              <>
                {fee.value}
                <span className="text-muted-foreground font-normal ml-0.5">
                  {fee.unit}
                </span>
              </>
            )}
          </span>
        </div>
      ))}
    </div>
  );
}
