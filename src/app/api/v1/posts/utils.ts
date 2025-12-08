import { ALLOWED_FILE_TYPE } from "@/constants/file";
import { isFileTypeValid } from "@/lib/file-utils";
import { MAX_FILE_SIZE } from "@/constants/file";
import { isFileSizeValid } from "@/lib/file-utils";
import { PostFormData } from "@/services/types/posts";
import { z } from "zod";

const createPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  propertyTypeId: z.number().min(1, "Property type is required"),
  area: z.number().min(1, "Area is required"),
  amenityIds: z
    .array(z.number())
    .min(1, "At least one amenity must be selected"),
  provinceCode: z.string().min(1, "Province is required"),
  districtCode: z.string().min(1, "District is required"),
  wardCode: z.string().min(1, "Ward is required"),
  address: z.string().min(1, "Address is required"),
  lat: z.number().min(1, "Latitude is required"),
  lng: z.number().min(1, "Longitude is required"),
  price: z.number().min(0, "Price is required"),
  deposit: z.number().min(0, "Deposit is required"),
  electricityBill: z.number().min(0, "Electricity bill is required"),
  waterBill: z.number().min(0, "Water bill is required"),
  internetBill: z.number().min(0, "Internet bill is required"),
  otherBill: z.number().min(0, "Other bills must be 0 or greater"),
  waterBillUnit: z.string().min(1, "Water bill unit is required"),
  internetBillUnit: z.string().min(1, "Internet bill unit is required"),
  termIds: z.array(z.number()), // Optional: user can choose not to select any terms
  images: z.array(z.any()).min(1, "At least one image is required"),
});

const updatePostSchema = createPostSchema.extend({
  deletedImageIds: z.array(z.number()).optional(),
  images: z.array(z.any()).optional(),
});

const validatePostData = async ({
  payload,
  images,
  isUpdate,
}: {
  payload: PostFormData["payload"];
  images: File[];
  isUpdate: boolean;
}): Promise<{
  errors: string[];
  data: (PostFormData["payload"] & { images: File[] }) | null;
}> => {
  const parseResult = isUpdate
    ? updatePostSchema.safeParse({
        ...payload,
        images,
      })
    : createPostSchema.safeParse({
        ...payload,
        images,
      });

  if (!parseResult.success) {
    const errors = parseResult.error.issues.map((issue) => issue.message);
    return { errors, data: null };
  }
  const data = parseResult.data as PostFormData["payload"] & { images: File[] };
  // Validate images file type and size
  const isImagesValid =
    isFileTypeValid(data.images, ALLOWED_FILE_TYPE.IMAGE) &&
    isFileSizeValid(data.images, MAX_FILE_SIZE);
  if (!isImagesValid) {
    const errors = ["Invalid image file type or size"];
    return { errors, data: null };
  }

  return { errors: [], data };
};

export const checkValidUpdatePostData = async ({
  payload,
  images,
}: {
  payload: PostFormData["payload"];
  images: File[];
}): Promise<{
  errors: string[];
  data: (PostFormData["payload"] & { images: File[] }) | null;
}> => {
  return validatePostData({
    payload,
    images,
    isUpdate: true,
  });
};

export const checkValidCreatePostData = async ({
  payload,
  images,
}: {
  payload: PostFormData["payload"];
  images: File[];
}): Promise<{
  errors: string[];
  data: (PostFormData["payload"] & { images: File[] }) | null;
}> => {
  return validatePostData({
    payload,
    images,
    isUpdate: false,
  });
};
