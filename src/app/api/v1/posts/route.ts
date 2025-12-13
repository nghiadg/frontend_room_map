import { uploadImageToCloudflareR2 } from "@/lib/s3/upload";
import { createClient } from "@/lib/supabase/server";
import { PostFormData } from "@/services/types/posts";
import { NextResponse } from "next/server";
import { checkValidCreatePostData } from "./utils";
import camelcaseKeys from "camelcase-keys";
import { POST_SOURCE } from "@/constants/post-source";
import { USER_ROLE } from "@/constants/user-role";
import { API_ERROR_CODE } from "@/constants/error-message";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  // Rate limit: 10 requests per minute for uploads
  const rateLimitResponse = await checkRateLimit(request, "upload");
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user profile with role info and phone number for validation
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("id, phone_number, roles(name)")
      .eq("user_id", user.id)
      .limit(1)
      .single();

    if (profileError || !profileData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has phone number before allowing post creation
    if (!profileData.phone_number) {
      return NextResponse.json(
        {
          error: "Phone number is required to create posts",
          code: API_ERROR_CODE.PHONE_REQUIRED,
        },
        { status: 400 }
      );
    }

    const userProfile = camelcaseKeys(profileData, { deep: true });
    const isAdmin =
      (userProfile as { roles?: { name?: string } }).roles?.name ===
      USER_ROLE.ADMIN;

    const formData = await request.formData();
    const images = formData.getAll("images") as unknown as File[];
    const payload = JSON.parse(
      formData.get("payload") as string
    ) as PostFormData["payload"];
    //   Validate data
    const { errors, data } = await checkValidCreatePostData({
      payload,
      images,
    });

    if (!data) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    // Upload images to cloudflare R2
    const uploadedImages = await Promise.all(
      data.images.map((image) => uploadImageToCloudflareR2(image))
    );

    const imageKeys = uploadedImages.map((image) => image.key);

    // Auto-detect source: admin users get 'admin', regular users get 'user'
    const postSource = isAdmin ? POST_SOURCE.ADMIN : POST_SOURCE.USER;

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
        _created_by: userProfile.id,
        _updated_by: userProfile.id,
        _amenity_ids: data.amenityIds,
        _term_ids: data.termIds,
        _images: imageKeys,
        _source: postSource,
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
