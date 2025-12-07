import { useTranslations } from "next-intl";
import FeesList from "./fees-list";

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

  return (
    <div className="py-6 lg:py-8 lg:hidden">
      <h2 className="text-xl md:text-2xl font-semibold mb-6">
        {t("posts.booking.services_fee")}
      </h2>
      <FeesList
        deposit={deposit}
        electricityBill={electricityBill}
        waterBill={waterBill}
        internetBill={internetBill}
        otherBill={otherBill}
        waterBillUnit={waterBillUnit}
        internetBillUnit={internetBillUnit}
        variant="mobile"
      />
    </div>
  );
}
