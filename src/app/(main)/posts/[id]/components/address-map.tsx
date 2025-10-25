import { MapPinIcon } from "lucide-react";
import Image from "next/image";

export default function AddressMap() {
  return (
    <div className="py-6 lg:py-8" id="location">
      <h2 className="text-xl md:text-2xl font-semibold mb-6">Địa chỉ</h2>
      <div className="flex items-start gap-3">
        <MapPinIcon className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
        <div>
          <p className="font-medium text-base mb-1">
            Quận 9, Thành phố Hồ Chí Minh
          </p>
          <p className="text-sm text-muted-foreground">
            Đường Nguyễn Văn Linh, Phường Phú Thạnh, Quận 9, Thành phố Hồ Chí
            Minh
          </p>
        </div>
      </div>
      <div className="h-[400px] rounded-xl overflow-hidden bg-muted mt-4">
        <Image
          src="https://media.wired.com/photos/59269cd37034dc5f91bec0f1/191:100/w_1280,c_limit/GoogleMapTA.jpg"
          alt="map"
          width={1280}
          height={400}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
