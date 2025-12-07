import { ComponentType } from "react";
import { IconProps } from "@/components/icons/types";
import IconMiniApartment from "@/components/icons/icon-mini-apartment";
import IconSingleRoom from "@/components/icons/icon-single-room";
import IconWholeHouse from "@/components/icons/icon-whole-house";
import IconOtherProperty from "@/components/icons/icon-other-property";

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
 * Mapping from property type key to corresponding icon component
 */
const PROPERTY_TYPE_ICONS: Record<PropertyTypeKey, ComponentType<IconProps>> = {
  [PROPERTY_TYPE_KEYS.MINI_APARTMENT]: IconMiniApartment,
  [PROPERTY_TYPE_KEYS.SINGLE_ROOM]: IconSingleRoom,
  [PROPERTY_TYPE_KEYS.WHOLE_HOUSE]: IconWholeHouse,
  [PROPERTY_TYPE_KEYS.OTHER]: IconOtherProperty,
};

/**
 * Get the icon component for a given property type key.
 * Falls back to IconOtherProperty if the key is not recognized.
 *
 * @param propertyTypeKey - The property type key from the database
 * @returns The corresponding icon component
 */
export function getPropertyTypeIcon(
  propertyTypeKey: string
): ComponentType<IconProps> {
  return (
    PROPERTY_TYPE_ICONS[propertyTypeKey as PropertyTypeKey] || IconOtherProperty
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
