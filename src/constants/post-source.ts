/**
 * Post source constants indicating who created the post.
 * Used to display different badges/icons for bot and admin posts.
 */
export const POST_SOURCE = {
  /** Regular user post */
  USER: "user",
  /** Post created by admin */
  ADMIN: "admin",
  /** Post created by automated bot/system */
  BOT: "bot",
} as const;

export type PostSource = (typeof POST_SOURCE)[keyof typeof POST_SOURCE];
