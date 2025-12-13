import { MetadataRoute } from "next";
import { APP_BRANDING } from "@/constants/app-branding";
import { createClient } from "@/lib/supabase/server";
import { POST_STATUS } from "@/constants/post-status";

/**
 * Dynamic sitemap generation for SEO
 * Includes static pages and all active post listings
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  // Static pages with high priority
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: APP_BRANDING.url,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${APP_BRANDING.url}/map`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
  ];

  // Dynamic post pages from database
  const { data: posts } = await supabase
    .from("posts")
    .select("id, updated_at")
    .eq("status", POST_STATUS.ACTIVE)
    .order("updated_at", { ascending: false });

  const postPages: MetadataRoute.Sitemap = (posts || []).map((post) => ({
    url: `${APP_BRANDING.url}/posts/${post.id}`,
    lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...postPages];
}
