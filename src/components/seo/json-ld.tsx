import { APP_BRANDING, APP_NAME } from "@/constants/app-branding";

/**
 * Safely serialize JSON-LD schema to prevent XSS attacks.
 * Escapes </script> and similar patterns that could break out of the script tag.
 */
function safeJsonLdStringify(schema: object): string {
  return JSON.stringify(schema)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

/**
 * Organization Schema - Helps Google understand this is a business/organization
 * Displays business info in Knowledge Panel
 */
export function OrganizationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: APP_NAME,
    url: APP_BRANDING.url,
    logo: `${APP_BRANDING.url}/logo.webp`,
    sameAs: [
      `https://twitter.com/${APP_BRANDING.twitter.handle.replace("@", "")}`,
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: APP_BRANDING.email,
      contactType: "customer service",
      availableLanguage: ["Vietnamese", "English"],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(schema) }}
    />
  );
}

/**
 * WebSite Schema with SearchAction - Enables sitelinks searchbox in Google
 */
export function WebSiteJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: APP_NAME,
    url: APP_BRANDING.url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${APP_BRANDING.url}/map?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(schema) }}
    />
  );
}

/**
 * RealEstateListing Schema for post details - Shows rich snippets with price, location
 */
interface RealEstateListingProps {
  post: {
    id: number;
    title: string;
    description: string;
    price: number;
    address: string;
    images: string[];
    createdAt?: string;
    provinceName?: string;
    districtName?: string;
  };
}

export function RealEstateListingJsonLd({ post }: RealEstateListingProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: post.title,
    description: post.description,
    url: `${APP_BRANDING.url}/posts/${post.id}`,
    offers: {
      "@type": "Offer",
      price: post.price,
      priceCurrency: "VND",
      availability: "https://schema.org/InStock",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: post.address,
      addressLocality: post.districtName,
      addressRegion: post.provinceName,
      addressCountry: "VN",
    },
    image: post.images,
    datePosted: post.createdAt,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(schema) }}
    />
  );
}
