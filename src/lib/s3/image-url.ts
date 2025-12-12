/**
 * Get the full URL for an image stored in Cloudflare R2
 * This is a client-safe function (no Node.js dependencies)
 */
export const getImageUrl = (key: string): string => {
  return `${process.env.NEXT_PUBLIC_R2_URL}/${key}`;
};
