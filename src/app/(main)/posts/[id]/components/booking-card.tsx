import HostAvatar from "@/components/host-avatar";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MessageCircleIcon, PhoneIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import FeesList from "./fees-list";

type BookingCardProps = {
  price: number;
  deposit: number;
  contactNumber: string;
  contactZalo: string;
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
  hostName,
  electricityBill,
  waterBill,
  internetBill,
  otherBill,
  waterBillUnit,
  internetBillUnit,
}: BookingCardProps) {
  const t = useTranslations();

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
          <div className="mb-4">
            <FeesList
              deposit={deposit}
              electricityBill={electricityBill}
              waterBill={waterBill}
              internetBill={internetBill}
              otherBill={otherBill}
              waterBillUnit={waterBillUnit}
              internetBillUnit={internetBillUnit}
              variant="card"
            />
          </div>

          {/* Contact Buttons */}
          <div className="space-y-3">
            <a
              href={`tel:${contactNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full block"
            >
              <Button
                className="w-full h-12 text-base font-semibold"
                size="lg"
                aria-label={t("posts.booking.call", { contactNumber })}
              >
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
                aria-label={t("posts.booking.send_message")}
              >
                <MessageCircleIcon className="w-5 h-5 mr-2" />
                {t("posts.booking.send_message")}
              </Button>
            </a>
          </div>

          <div className="mt-6 pt-6 border-t">
            <HostAvatar name={hostName} avatar="#" />
          </div>
        </div>
      </div>
    </div>
  );
}
