import { AMENITIES_ICON_MAP } from "@/constants/amenities";
import { Amenity } from "@/types/amenities";
type AmenitiesProps = {
  amenities: Amenity[];
};
export default function Amenities({ amenities }: AmenitiesProps) {
  return (
    <div className="py-6 lg:py-8">
      <h2 className="text-xl md:text-2xl font-semibold mb-6">
        Tiện nghi và trang thiết bị
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {amenities.map((amenity) => {
          const Icon = AMENITIES_ICON_MAP[amenity.key];
          return (
            <div className="flex items-center gap-3" key={amenity.id}>
              {Icon && <Icon className="w-6 h-6 text-primary flex-shrink-0" />}
              <span className="text-base ">{amenity.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
