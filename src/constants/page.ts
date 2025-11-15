export const PAGE_PATH = {
  ACCOUNT_PROFILE: "/account/profile",
  ACCOUNT_NOTIFICATION: "/account/notification",
  ACCOUNT_MANAGE_POSTS: "/account/posts",
  POSTS_CREATE: "/posts/create",
  POSTS_EDIT: (id: string) => `/posts/edit/${id}`,
} as const;
