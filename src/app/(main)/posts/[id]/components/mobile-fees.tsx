import { formatPrice } from "@/lib/utils";
import { useTranslations } from "next-intl";

type MobileFeesProps = {
  deposit: number;
  electricityBill: number;
  waterBill: number;
  internetBill: number;
  otherBill: number;
  waterBillUnit: "month" | "m3";
  internetBillUnit: "month" | "person";
};

export default function MobileFees({
  deposit,
  electricityBill,
  waterBill,
  internetBill,
  otherBill,
  waterBillUnit,
  internetBillUnit,
}: MobileFeesProps) {
  const t = useTranslations();
  const fees = [
    {
      label: t("common.deposit"),
      value: formatPrice(deposit),
      unit: t("common.price_unit"),
    },
    {
      label: t("posts.booking.electricity_bill"),
      value: formatPrice(electricityBill),
      unit: t("common.electricity_bill_unit_kwh"),
    },
    {
      label: t("posts.booking.water_bill"),
      value: formatPrice(waterBill),
      unit:
        waterBillUnit === "month"
          ? t("common.water_bill_unit_month")
          : t("common.water_bill_unit_m3"),
    },
    {
      label: t("posts.booking.internet_bill"),
      value: formatPrice(internetBill),
      unit:
        internetBillUnit === "month"
          ? t("common.internet_bill_unit_month")
          : t("common.internet_bill_unit_person"),
    },
    {
      label: t("posts.booking.other_bill"),
      value: formatPrice(otherBill),
      unit: t("common.price_unit") + "/" + t("common.month"),
    },
  ];
  return (
    <div className="py-6 lg:py-8 lg:hidden">
      <h2 className="text-xl md:text-2xl font-semibold mb-6">
        {t("posts.booking.services_fee")}
      </h2>
      <div className="flex flex-col gap-2">
        {fees.map((fee) => (
          <div
            key={fee.label}
            className="flex items-center justify-between px-4 py-3 rounded-lg bg-muted"
          >
            <span className="font-medium text-sm text-muted-foreground">
              {fee.label}
            </span>
            <span className="font-semibold text-base">
              {fee.value}
              {fee.unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
