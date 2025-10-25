import { Button } from "@/components/ui/button";
import { HandshakeIcon, MessageCircleIcon, PhoneIcon } from "lucide-react";

export default function MobileBottomBookingBar() {
  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN");
  };
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t shadow-lg">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold">{formatPrice(1000000)}đ</span>
              <span className="text-sm text-muted-foreground">/ tháng</span>
            </div>
            {true && (
              <div className="flex items-center gap-2">
                <HandshakeIcon className="w-4 h-4 text-primary" />
                <p className="text-xs text-primary">Có thể thương lượng</p>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="lg" className="h-11 px-4">
              <MessageCircleIcon className="w-5 h-5" />
            </Button>
            <Button size="lg" className="h-11 px-6">
              <PhoneIcon className="w-4 h-4 mr-2" />
              Gọi ngay
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
