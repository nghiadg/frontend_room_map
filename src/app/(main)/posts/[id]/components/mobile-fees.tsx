import { formatPrice } from "@/lib/utils";

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
  const fees = [
    {
      label: "Đặt cọc",
      value: formatPrice(deposit),
      unit: "đ",
    },
    {
      label: "Tiền điện",
      value: formatPrice(electricityBill),
      unit: waterBillUnit === "month" ? "đ/tháng" : "đ/số điện",
    },
    {
      label: "Tiền nước",
      value: formatPrice(waterBill),
      unit: waterBillUnit === "month" ? "đ/tháng" : "đ/m³",
    },
    {
      label: "Tiền internet",
      value: formatPrice(internetBill),
      unit: internetBillUnit === "month" ? "đ/tháng" : "đ/người",
    },
    {
      label: "Tiền khác",
      value: formatPrice(otherBill),
      unit: "đ/tháng",
    },
  ];
  return (
    <div className="py-6 lg:py-8 lg:hidden">
      <h2 className="text-xl md:text-2xl font-semibold mb-6">Phí dịch vụ</h2>
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
