import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { PostFormData } from "@/services/types/posts";
import { uploadImageToCloudflareR2 } from "@/lib/s3/upload";
import { checkValidUpdatePostData } from "../utils";
import camelcaseKeys from "camelcase-keys";
import { POST_STATUS } from "@/constants/post-status";
import { API_ERROR_CODE } from "@/constants/error-message";

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

    // Get user profile with phone number for validation
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("id, phone_number")
      .eq("user_id", user.id)
      .limit(1)
      .single();

    if (profileError || !profileData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has phone number before allowing post update
    if (!profileData.phone_number) {
      return NextResponse.json(
        {
          error: "Phone number is required to edit posts",
          code: API_ERROR_CODE.PHONE_REQUIRED,
        },
        { status: 400 }
      );
    }

    const userProfile = camelcaseKeys(profileData);

    // check post belongs to user and is editable (not deleted or rented)
    const { data: existPost } = await supabase
      .from("posts")
      .select("id, created_by, status")
      .eq("id", id)
      .eq("status", POST_STATUS.ACTIVE)
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

/**
 * DELETE /api/v1/posts/[id]
 * Soft delete a post (owner only)
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate post ID
    const postId = parseInt(id, 10);
    if (isNaN(postId) || postId <= 0) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
    }

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

    const userProfileId = profileData.id;

    // Check if post exists and is not already deleted
    const { data: existPost, error: postError } = await supabase
      .from("posts")
      .select("id, created_by, status")
      .eq("id", postId)
      .single();

    if (postError || !existPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check ownership
    if (existPost.created_by !== userProfileId) {
      return NextResponse.json(
        { error: "You are not authorized to delete this post" },
        { status: 403 }
      );
    }

    // Check if already deleted
    if (existPost.status === POST_STATUS.DELETED) {
      return NextResponse.json(
        { error: "Post is already deleted" },
        { status: 400 }
      );
    }

    // Soft delete the post
    const { error: updateError } = await supabase
      .from("posts")
      .update({
        status: POST_STATUS.DELETED,
        deleted_by: userProfileId,
        deleted_at: new Date().toISOString(),
      })
      .eq("id", postId);

    if (updateError) {
      console.error("Delete error:", updateError);
      return NextResponse.json(
        { error: "Failed to delete post" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Post deleted successfully" },
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
