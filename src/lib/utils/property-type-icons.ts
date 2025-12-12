/**
 * Property type keys matching the database values
 */
export const PROPERTY_TYPE_KEYS = {
  MINI_APARTMENT: "mini_apartment",
  SINGLE_ROOM: "1b1l",
  WHOLE_HOUSE: "whole_house",
  OTHER: "other",
} as const;

export type PropertyTypeKey =
  (typeof PROPERTY_TYPE_KEYS)[keyof typeof PROPERTY_TYPE_KEYS];

/**
 * Translation keys for property type labels.
 * Maps database key to i18n translation key.
 */
export const PROPERTY_TYPE_LABELS: Record<PropertyTypeKey, string> = {
  [PROPERTY_TYPE_KEYS.MINI_APARTMENT]: "property_types.mini_apartment",
  [PROPERTY_TYPE_KEYS.SINGLE_ROOM]: "property_types.1b1l",
  [PROPERTY_TYPE_KEYS.WHOLE_HOUSE]: "property_types.whole_house",
  [PROPERTY_TYPE_KEYS.OTHER]: "property_types.other",
};

/**
 * SVG icon paths for each property type.
 * Used for map markers with colorful icons.
 */
export const PROPERTY_TYPE_ICON_PATHS: Record<PropertyTypeKey, string> = {
  [PROPERTY_TYPE_KEYS.MINI_APARTMENT]: "/icons/property-mini-apartment.svg",
  [PROPERTY_TYPE_KEYS.SINGLE_ROOM]: "/icons/property-single-room.svg",
  [PROPERTY_TYPE_KEYS.WHOLE_HOUSE]: "/icons/property-whole-house.svg",
  [PROPERTY_TYPE_KEYS.OTHER]: "/icons/property-other.svg",
};

/**
 * Get the SVG icon path for a given property type key.
 * Falls back to "other" icon if the key is not recognized.
 *
 * @param propertyTypeKey - The property type key from the database
 * @returns The SVG file path
 */
export function getPropertyTypeIconPath(propertyTypeKey: string): string {
  return (
    PROPERTY_TYPE_ICON_PATHS[propertyTypeKey as PropertyTypeKey] ||
    PROPERTY_TYPE_ICON_PATHS.other
  );
}

/**
 * Get the translation key for a given property type key.
 * Falls back to "other" translation if the key is not recognized.
 *
 * @param propertyTypeKey - The property type key from the database
 * @returns The i18n translation key
 */
export function getPropertyTypeLabelKey(propertyTypeKey: string): string {
  return (
    PROPERTY_TYPE_LABELS[propertyTypeKey as PropertyTypeKey] ||
    PROPERTY_TYPE_LABELS.other
  );
}
