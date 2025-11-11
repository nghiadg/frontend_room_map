import { ALLOWED_FILE_TYPE, MAX_FILE_SIZE } from "@/constants/file";
import { isFileSizeValid, isFileTypeValid } from "@/lib/file-utils";
import { uploadImageToCloudflareR2 } from "@/lib/s3/utils";
import { createClient } from "@/lib/supabase/server";
import { CreatePostData } from "@/services/types/posts";
import { NextResponse } from "next/server";
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
  price: z.number().min(1, "Price is required"),
  deposit: z.number().min(1, "Deposit is required"),
  electricityBill: z.number().min(1, "Electricity bill is required"),
  waterBill: z.number().min(1, "Water bill is required"),
  internetBill: z.number().min(1, "Internet bill is required"),
  otherBill: z.number().min(1, "Other bills are required"),
  waterBillUnit: z.string().min(1, "Water bill unit is required"),
  internetBillUnit: z.string().min(1, "Internet bill unit is required"),
  termIds: z.array(z.number()).min(1, "At least one term must be selected"),
  images: z.array(z.any()).min(1, "At least one image is required"),
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const images = formData.getAll("images") as unknown as File[];
    const payload = JSON.parse(
      formData.get("payload") as string
    ) as CreatePostData["payload"];
    //   Validate data
    const parseResult = createPostSchema.safeParse({
      ...payload,
      images,
    });

    if (!parseResult.success) {
      const errors = parseResult.error.issues.map((issue) => issue.message);
      return NextResponse.json({ errors }, { status: 400 });
    }
    const data = parseResult.data;
    // Validate images file type and size
    const isImagesValid =
      isFileTypeValid(data.images, ALLOWED_FILE_TYPE.IMAGE) &&
      isFileSizeValid(data.images, MAX_FILE_SIZE);
    if (!isImagesValid) {
      const errors = ["Invalid image file type or size"];
      return NextResponse.json({ errors }, { status: 400 });
    }

    // Update images to cloudflare R2
    const uploadedImages = await Promise.all(
      data.images.map(async (image) => {
        const uploadedImage = await uploadImageToCloudflareR2(image);
        return uploadedImage;
      })
    );

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const imageKeys = uploadedImages.map((image) => image.key);

    const { data: post } = await supabase
      .rpc("insert_post", {
        _title: data.title,
        _description: data.description,
        _property_type_id: data.propertyTypeId,
        _area: data.area,
        _province_code: data.provinceCode,
        _district_code: data.districtCode,
        _ward_code: data.wardCode,
        _address: data.address,
        _lat: data.lat,
        _lng: data.lng,
        _price: data.price,
        _deposit: data.deposit,
        _electricity_bill: data.electricityBill,
        _water_bill: data.waterBill,
        _internet_bill: data.internetBill,
        _other_bill: data.otherBill,
        _water_bill_unit: data.waterBillUnit,
        _internet_bill_unit: data.internetBillUnit,
        _created_by: user.id,
        _updated_by: user.id,
        _amenity_ids: data.amenityIds,
        _term_ids: data.termIds,
        _images: imageKeys,
      })
      .throwOnError();

    return NextResponse.json(
      { message: "Post created successfully", data: post },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
