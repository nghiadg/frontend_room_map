import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { PostFormData } from "@/services/types/posts";
import { uploadImageToCloudflareR2 } from "@/lib/s3/utils";
import { checkValidUpdatePostData } from "../utils";
import camelcaseKeys from "camelcase-keys";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user profile
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", user.id)
      .limit(1)
      .single();

    if (profileError || !profileData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userProfile = camelcaseKeys(profileData);

    // check post belongs to user
    const { data: existPost } = await supabase
      .from("posts")
      .select("id, created_by")
      .eq("id", id)
      .eq("is_rented", false)
      .eq("is_deleted", false)
      .eq("created_by", userProfile.id)
      .single();
    if (!existPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const formData = await request.formData();
    const images = formData.getAll("images") as unknown as File[];
    const payload = JSON.parse(
      formData.get("payload") as string
    ) as PostFormData["payload"];
    //   Validate data
    const { errors, data } = await checkValidUpdatePostData({
      payload,
      images,
    });
    if (!data) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    // Update images to cloudflare R2
    const uploadedImages = await Promise.all(
      data.images.map(async (image) => {
        const uploadedImage = await uploadImageToCloudflareR2(image);
        return uploadedImage;
      })
    );

    const imageKeys = uploadedImages.map((image) => image.key);

    const { data: post } = await supabase
      .rpc("update_post", {
        _id: Number(id),
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
        _updated_by: userProfile.id,
        _amenity_ids: data.amenityIds,
        _term_ids: data.termIds,
        _images: imageKeys,
        _deleted_image_ids: data.deletedImageIds,
      })
      .throwOnError();

    return NextResponse.json(
      { message: "Post updated successfully", data: post },
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
