import HostAvatar from "@/components/host-avatar";
import { Button } from "@/components/ui/button";
import { HandshakeIcon, MessageCircleIcon, PhoneIcon } from "lucide-react";

export default function BookingCard() {
  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN");
  };
  return (
    <div className="hidden lg:block w-full lg:w-[370px]">
      <div className="lg:sticky lg:top-24">
        <div className="border rounded-xl shadow-lg p-4">
          {/* Price */}
          <div className="mb-6">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold">
                {formatPrice(1000000)}đ
              </span>
              <span className="text-base text-muted-foreground">/ tháng</span>
            </div>
            {true && (
              <p className="text-sm text-primary mt-1 flex items-center gap-2">
                <HandshakeIcon className="w-4 h-4" />
                <span>Có thể thương lượng</span>
              </p>
            )}
          </div>

          {/* Booking Info */}
          <div className="grid grid-cols-1 gap-3 mb-4">
            <div className="border rounded-lg p-2">
              <p className="text-xs font-semibold mb-1">ĐẶT CỌC</p>
              <p className="text-sm">{formatPrice(1000000)}đ</p>
            </div>
            <div className="border rounded-lg p-2">
              <p className="text-xs font-semibold mb-1">
                THỜI GIAN THUÊ TỐI THIỂU
              </p>
              <p className="text-sm">1 tháng</p>
            </div>
          </div>

          {/* Contact Buttons */}
          <div className="space-y-3">
            <Button className="w-full h-12 text-base font-semibold" size="lg">
              <PhoneIcon className="w-5 h-5 mr-2" />
              Gọi 0909090909
            </Button>
            <Button
              variant="outline"
              className="w-full h-12 text-base font-semibold"
              size="lg"
            >
              <MessageCircleIcon className="w-5 h-5 mr-2" />
              Nhắn tin Zalo
            </Button>
          </div>

          <div className="mt-6 pt-6 border-t">
            <HostAvatar
              name="Nguyễn Văn A"
              avatar="https://www.bhg.com/thmb/H9VV9JNnKl-H1faFXnPlQfNprYw=/1799x0/filters:no_upscale():strip_icc()/white-modern-house-curved-patio-archway-c0a4a3b3-aa51b24d14d0464ea15d36e05aa85ac9.jpg"
            />
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>
                Đăng ngày {new Date("2025-01-01").toLocaleDateString("vi-VN")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
