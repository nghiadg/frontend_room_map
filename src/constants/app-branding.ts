/**
 * Application branding constants
 * Centralized brand configuration to ensure consistency across the application
 */

export const APP_NAME = "RoomMap" as const;

export const APP_BRANDING = {
  name: APP_NAME,
  tagline: "Find Houses, Apartments & Rooms for Rent in Vietnam",
  domain: "roommap.vn",
  url: "https://www.roommap.vn",
  email: "support@roommap.vn",
  twitter: {
    handle: "@RoomMapVN",
    site: "@RoomMapVN",
  },
  openGraph: {
    imageUrl: "https://roommap.vn/og-image.jpg",
  },
} as const;

export const APP_METADATA = {
  title: `${APP_NAME} | ${APP_BRANDING.tagline}`,
  description: `Explore thousands of houses, apartments, and rooms for rent on ${APP_NAME}. Find your perfect rental property in Vietnam with advanced search, verified listings, and detailed information.`,
  keywords: [
    APP_NAME.toLowerCase(),
    "Vietnam rental",
    "apartments for rent",
    "houses for rent",
    "rooms for rent",
    "find rental",
    "property search",
    "real estate Vietnam",
    "rent property",
  ],
};

export const COPYRIGHT_YEAR = new Date().getFullYear();
export const COPYRIGHT_TEXT = `© ${COPYRIGHT_YEAR} ${APP_NAME}. Đã đăng ký bản quyền.`;
