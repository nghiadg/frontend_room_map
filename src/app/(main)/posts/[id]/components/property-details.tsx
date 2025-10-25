import { CalendarIcon, HomeIcon, KeyIcon, ShieldCheckIcon } from "lucide-react";

export default function PropertyDetails() {
  return (
    <div className="py-6 lg:py-8 border-b space-y-6">
      <div className="flex gap-4">
        <HomeIcon className="w-6 h-6 flex-shrink-0 mt-1" />
        <div>
          <p className="font-semibold mb-1">1 phòng ngủ</p>
          <p className="text-sm text-muted-foreground">
            Phòng riêng, không chung chủ
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <ShieldCheckIcon className="w-6 h-6 flex-shrink-0 mt-1" />
        <div>
          <p className="font-semibold mb-1">1 phòng tắm</p>
          <p className="text-sm text-muted-foreground">
            Phòng riêng, có WC riêng
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <KeyIcon className="w-6 h-6 flex-shrink-0 mt-1" />
        <div>
          <p className="font-semibold mb-1">Tự nhận phòng</p>
          <p className="text-sm text-muted-foreground">
            Bạn có thể tự nhận phòng với mã khóa
          </p>
        </div>
      </div>

      {true && (
        <div className="flex gap-4">
          <CalendarIcon className="w-6 h-6 flex-shrink-0 mt-1" />
          <div>
            <p className="font-semibold mb-1">Thời hạn thuê tối thiểu</p>
            <p className="text-sm text-muted-foreground">
              Yêu cầu thuê tối thiểu
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
