import { MetadataRoute } from "next";
import { APP_BRANDING } from "@/constants/app-branding";

/**
 * Robots.txt configuration for search engine crawlers
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/profile/setup", "/account/"],
      },
    ],
    sitemap: `${APP_BRANDING.url}/sitemap.xml`,
  };
}
