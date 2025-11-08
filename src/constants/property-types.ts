import { Building, Building2, Hotel, House } from "lucide-react";

export const PROPERTY_TYPES_ICON_MAP: Record<string, React.ElementType> = {
  mini_apartment: Building,
  "1b1l": Building2,
  whole_house: House,
  other: Hotel,
} as const;
