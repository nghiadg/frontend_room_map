import { WifiIcon } from "lucide-react";

export default function Amenities() {
  return (
    <div className="py-6 lg:py-8">
      <h2 className="text-xl md:text-2xl font-semibold mb-6">
        Tiện nghi và trang thiết bị
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-start gap-3">
          <WifiIcon className="w-6 h-6 text-primary flex-shrink-0" />
          <span className="text-base">Wifi</span>
        </div>
      </div>
    </div>
  );
}
