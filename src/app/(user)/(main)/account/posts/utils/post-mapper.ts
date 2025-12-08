import { Post } from "@/types/post";
import { getImageUrl } from "@/lib/s3/utils";
import {
  PostStatus as DBPostStatus,
  POST_STATUS,
} from "@/constants/post-status";

type PostCardStatus =
  | "active"
  | "pending"
  | "draft"
  | "expired"
  | "hidden"
  | "rented";

export type PostCardProps = {
  id: string;
  thumbnail: string;
  title: string;
  status: PostCardStatus;
  publishedAt: Date;
  price: number;
  deposit: number;
  area: number;
  address: string;
  propertyType: string;
  imageCount: number;
};

/**
 * Maps DB status to PostCard display status
 */
function mapDBStatusToCardStatus(status: DBPostStatus): PostCardStatus {
  switch (status) {
    case POST_STATUS.ACTIVE:
      return "active";
    case POST_STATUS.HIDDEN:
      return "hidden";
    case POST_STATUS.RENTED:
      return "rented";
    case POST_STATUS.DELETED:
      return "expired"; // Deleted posts show as expired in card
    default:
      return "active";
  }
}

/**
 * Maps API Post response to PostCard component props
 * Note: Status labels are handled via i18n in the component
 */
export function mapPostToCardProps(post: Post): PostCardProps {
  // Map DB status to card status
  const status = mapDBStatusToCardStatus(post.status);

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
