import { Post } from "@/types/post";
import { getImageUrl } from "@/lib/s3/utils";

type PostStatus = "active" | "pending" | "draft" | "expired" | "hidden";

export type PostCardProps = {
  id: string;
  thumbnail: string;
  title: string;
  status: PostStatus;
  publishedAt: Date;
  price: number;
  deposit: number;
  area: number;
  address: string;
  propertyType: string;
  imageCount: number;
};

/**
 * Maps API Post response to PostCard component props
 * Note: Status labels are handled via i18n in the component
 */
export function mapPostToCardProps(post: Post): PostCardProps {
  // Determine status based on database fields
  // Note: is_published field doesn't exist yet, so we use simplified logic
  let status: PostStatus = "active";

  if (post.isRented) {
    status = "expired";
  }
  // When is_published is added, uncomment:
  // else if (!post.isPublished) {
  //   status = "pending";
  // }

  // Get thumbnail from first image or use placeholder
  // Convert storage key to full URL using getImageUrl
  const thumbnail =
    post.postImages && post.postImages.length > 0
      ? getImageUrl(post.postImages[0].url)
      : "/placeholder-image.jpg";

  // Get property type name (will be i18n in component if needed)
  const propertyType = post.propertyTypes?.name || "";

  return {
    id: post.id.toString(),
    thumbnail,
    title: post.title,
    status,
    publishedAt: post.createdAt ? new Date(post.createdAt) : new Date(),
    price: post.price,
    deposit: post.deposit,
    area: post.area,
    address: post.address,
    propertyType,
    imageCount: post.postImages?.length || 0,
  };
}
