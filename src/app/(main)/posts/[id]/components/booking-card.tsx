import HostAvatar from "@/components/host-avatar";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MessageCircleIcon, PhoneIcon } from "lucide-react";
import { useMemo } from "react";
import { useTranslations } from "next-intl";

type BookingCardProps = {
  price: number;
  deposit: number;
  contactNumber: string;
  contactZalo: string;
  publishedAt: string;
  hostName: string;
  electricityBill: number;
  waterBill: number;
  internetBill: number;
  otherBill: number;
  waterBillUnit: "month" | "m3";
  internetBillUnit: "month" | "person";
};
export default function BookingCard({
  price,
  deposit,
  contactNumber,
  contactZalo,
  publishedAt,
  hostName,
  electricityBill,
  waterBill,
  internetBill,
  otherBill,
  waterBillUnit,
  internetBillUnit,
}: BookingCardProps) {
  const t = useTranslations();
  const fees = useMemo(() => {
    return [
      {
        label: t("posts.booking.deposit"),
        value: formatPrice(deposit),
        unit: "đ",
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
  }, [
    deposit,
    electricityBill,
    t,
    waterBill,
    waterBillUnit,
    internetBill,
    internetBillUnit,
    otherBill,
  ]);

  return (
    <div className="hidden lg:block w-full lg:w-[370px]">
      <div className="lg:sticky lg:top-24">
        <div className="border rounded-xl shadow-lg p-4">
          {/* Price */}
          <div className="mb-6">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold">
                {formatPrice(price)}đ
              </span>
              <span className="text-base text-muted-foreground">
                / {t("common.month")}
              </span>
            </div>
          </div>

          {/* Booking Info */}
          <div className="grid grid-cols-1 gap-3 mb-4">
            {fees.map((fee) => (
              <div
                className="border rounded-lg p-2 flex items-center justify-between"
                key={fee.label}
              >
                <p className="text-xs font-semibold">{fee.label}</p>
                <p className="text-sm">
                  {fee.value}
                  {fee.unit}
                </p>
              </div>
            ))}
          </div>

          {/* Contact Buttons */}
          <div className="space-y-3">
            <a
              href={`tel:${contactNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full block"
            >
              <Button className="w-full h-12 text-base font-semibold" size="lg">
                <PhoneIcon className="w-5 h-5 mr-2" />
                {t("posts.booking.call", { contactNumber })}
              </Button>
            </a>
            <a
              href={`https://zalo.me/${contactZalo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full block"
            >
              <Button
                variant="outline"
                className="w-full h-12 text-base font-semibold"
                size="lg"
              >
                <MessageCircleIcon className="w-5 h-5 mr-2" />
                {t("posts.booking.send_message")}
              </Button>
            </a>
          </div>

          <div className="mt-6 pt-6 border-t">
            <HostAvatar name={hostName} avatar="#" />
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>
                {t("posts.booking.published_at", {
                  publishedAt: new Date(publishedAt).toLocaleDateString(
                    "vi-VN"
                  ),
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
