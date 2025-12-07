import { Button } from "@/components/ui/button";
import { MessageCircleIcon, PhoneIcon } from "lucide-react";
import { useTranslations } from "next-intl";

type MobileBottomBookingBarProps = {
  price: number;
  deposit: number;
  contactNumber: string;
  contactZalo: string;
};

export default function MobileBottomBookingBar({
  price,
  deposit,
  contactNumber,
  contactZalo,
}: MobileBottomBookingBarProps) {
  const t = useTranslations();
  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN");
  };
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t shadow-lg">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold">{formatPrice(price)}đ</span>
              <span className="text-sm text-muted-foreground">
                / {t("common.month")}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <p>{t("common.deposit")}:</p>
              <p>{formatPrice(deposit)}đ</p>
            </div>
          </div>
          <div className="flex gap-2">
            <a
              href={`https://zalo.me/${contactZalo}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="lg" className="h-11 px-4">
                <MessageCircleIcon className="w-5 h-5" />
              </Button>
            </a>
            <a
              href={`tel:${contactNumber}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" className="h-11 px-6">
                <PhoneIcon className="w-4 h-4 mr-2" />
                {t("common.call_now")}
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
