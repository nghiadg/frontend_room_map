import { ERROR_MESSAGE } from "@/constants/error-message";
import { z } from "zod";

// =============================================================================
// Reusable Zod Schemas for Complex Types
// =============================================================================

const propertyTypeSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    key: z.string(),
    orderIndex: z.number(),
    description: z.string().nullish(),
  })
  .passthrough();

const provinceSchema = z
  .object({
    code: z.string(),
    name: z.string(),
  })
  .passthrough();

const districtSchema = z
  .object({
    code: z.string(),
    name: z.string(),
    provinceCode: z.string(),
  })
  .passthrough();

const wardSchema = z
  .object({
    code: z.string(),
    name: z.string(),
    districtCode: z.string(),
  })
  .passthrough();

const amenitySchema = z
  .object({
    id: z.number(),
    name: z.string(),
    key: z.string(),
    orderIndex: z.number(),
  })
  .passthrough();

// =============================================================================
// Section Schemas (Separated for validation status checking)
// =============================================================================

export const basicInformationSchema = z.object({
  title: z
    .string()
    .min(1, { message: ERROR_MESSAGE.REQUIRED })
    .max(100, { message: ERROR_MESSAGE.MAX_LENGTH(100) }),
  description: z
    .string()
    .min(1, { message: ERROR_MESSAGE.REQUIRED })
    .max(3000, { message: ERROR_MESSAGE.MAX_LENGTH(3000) }),
  propertyType: propertyTypeSchema.optional(),
  area: z.string().min(1, { message: ERROR_MESSAGE.REQUIRED }),
  amenities: z.array(amenitySchema).min(1, { message: ERROR_MESSAGE.REQUIRED }),
});

export const locationSchema = z.object({
  province: provinceSchema.optional(),
  district: districtSchema.optional(),
  ward: wardSchema.optional(),
  address: z.string().min(1, { message: ERROR_MESSAGE.REQUIRED }),
  lat: z.number({ message: ERROR_MESSAGE.REQUIRED }).optional(),
  lng: z.number({ message: ERROR_MESSAGE.REQUIRED }).optional(),
});

export const priceAndTermsSchema = z.object({
  price: z.string().min(1, { message: ERROR_MESSAGE.REQUIRED }),
  deposit: z.string().min(1, { message: ERROR_MESSAGE.REQUIRED }),
  electricityBill: z.string().min(1, { message: ERROR_MESSAGE.REQUIRED }),
  waterBill: z.string().min(1, { message: ERROR_MESSAGE.REQUIRED }),
  internetBill: z.string().min(1, { message: ERROR_MESSAGE.REQUIRED }),
  otherBill: z.string().min(1, { message: ERROR_MESSAGE.REQUIRED }),
  waterBillUnit: z.enum(["month", "m3"]),
  internetBillUnit: z.enum(["month", "person"]),
  terms: z.array(z.number()),
});

export const uploadImagesSchema = z.object({
  images: z
    .array(
      z.object({
        file: z.instanceof(File),
        previewUrl: z.string(),
        alt: z.string().optional(),
        id: z.string(),
        isUploaded: z.boolean().optional(),
      })
    )
    .min(1, { message: ERROR_MESSAGE.REQUIRED })
    .max(10, { message: ERROR_MESSAGE.MAX_LENGTH(10) }),
});

// =============================================================================
// Unified Form Schema
// =============================================================================

export const postFormSchema = basicInformationSchema
  .merge(locationSchema)
  .merge(priceAndTermsSchema)
  .merge(uploadImagesSchema);

export type PostFormValues = z.infer<typeof postFormSchema>;

// =============================================================================
// Section Keys (For form validation grouping)
// =============================================================================

export const FORM_SECTION_KEYS = {
  BASIC_INFORMATION: "basic-information",
  LOCATION: "location",
  PRICE_AND_TERMS: "price-and-terms",
  UPLOAD_IMAGES: "upload-images",
} as const;

export type FormSectionKey =
  (typeof FORM_SECTION_KEYS)[keyof typeof FORM_SECTION_KEYS];

// =============================================================================
// Section Field Mappings (For validation status checking)
// =============================================================================

export const SECTION_FIELDS: Record<FormSectionKey, (keyof PostFormValues)[]> =
  {
    [FORM_SECTION_KEYS.BASIC_INFORMATION]: [
      "title",
      "description",
      "propertyType",
      "area",
      "amenities",
    ],
    [FORM_SECTION_KEYS.LOCATION]: [
      "province",
      "district",
      "ward",
      "address",
      "lat",
      "lng",
    ],
    [FORM_SECTION_KEYS.PRICE_AND_TERMS]: [
      "price",
      "deposit",
      "electricityBill",
      "waterBill",
      "internetBill",
      "otherBill",
      "waterBillUnit",
      "internetBillUnit",
      "terms",
    ],
    [FORM_SECTION_KEYS.UPLOAD_IMAGES]: ["images"],
  };

// Required fields for "pending" status check (excludes optional fields like terms)
export const REQUIRED_SECTION_FIELDS: Record<
  FormSectionKey,
  (keyof PostFormValues)[]
> = {
  [FORM_SECTION_KEYS.BASIC_INFORMATION]: [
    "title",
    "description",
    "propertyType",
    "area",
    "amenities",
  ],
  [FORM_SECTION_KEYS.LOCATION]: [
    "province",
    "district",
    "ward",
    "address",
    "lat",
    "lng",
  ],
  [FORM_SECTION_KEYS.PRICE_AND_TERMS]: [
    "price",
    "deposit",
    "electricityBill",
    "waterBill",
    "internetBill",
    "otherBill",
    // Note: terms, waterBillUnit, internetBillUnit are optional - have defaults or can be empty
  ],
  [FORM_SECTION_KEYS.UPLOAD_IMAGES]: ["images"],
};

// =============================================================================
// Section Metadata
// =============================================================================

export const FORM_SECTIONS = [
  {
    key: FORM_SECTION_KEYS.BASIC_INFORMATION,
    labelKey: "posts.basic_information.section_title",
    descriptionKey: "posts.basic_information.section_description",
    step: 1,
  },
  {
    key: FORM_SECTION_KEYS.LOCATION,
    labelKey: "posts.location.section_title",
    descriptionKey: "posts.location.section_description",
    step: 2,
  },
  {
    key: FORM_SECTION_KEYS.PRICE_AND_TERMS,
    labelKey: "posts.price_and_terms.section_title",
    descriptionKey: "posts.price_and_terms.section_description",
    step: 3,
  },
  {
    key: FORM_SECTION_KEYS.UPLOAD_IMAGES,
    labelKey: "posts.upload_images.section_title",
    descriptionKey: "posts.upload_images.section_description",
    step: 4,
  },
] as const;
