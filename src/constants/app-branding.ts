/**
 * Application branding constants
 * Centralized brand configuration to ensure consistency across the application
 */

export const APP_NAME = "RoomMap" as const;

/**
 * Domain configuration - can be overridden via NEXT_PUBLIC_APP_DOMAIN env var
 * Default: roommap.vn
 */
const APP_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN || "roommap.vn";

/**
 * Support email - can be overridden via NEXT_PUBLIC_SUPPORT_EMAIL env var
 * Default: support@{domain}
 */
const SUPPORT_EMAIL =
  process.env.NEXT_PUBLIC_SUPPORT_EMAIL || `support@${APP_DOMAIN}`;

export const APP_BRANDING = {
  name: APP_NAME,
  tagline: "Tìm Nhà, Căn Hộ & Phòng Trọ Cho Thuê tại Việt Nam",
  domain: APP_DOMAIN,
  url: `https://${APP_DOMAIN}`,
  email: SUPPORT_EMAIL,
  twitter: {
    handle: "@RoomMapVN",
    site: "@RoomMapVN",
  },
  openGraph: {
    imageUrl: `https://${APP_DOMAIN}/og-image.jpg`,
  },
} as const;

export const APP_METADATA = {
  title: `${APP_NAME} | ${APP_BRANDING.tagline}`,
  description: `Khám phá hàng ngàn nhà, căn hộ và phòng trọ cho thuê trên ${APP_NAME}. Tìm nơi ở hoàn hảo tại Việt Nam với tìm kiếm nâng cao, bài đăng xác thực và thông tin chi tiết.`,
  keywords: [
    // Brand
    APP_NAME.toLowerCase(),
    "roommap",
    "room map",
    // Vietnamese keywords - Primary
    "thuê nhà",
    "cho thuê phòng trọ",
    "tìm phòng trọ",
    "thuê căn hộ",
    "nhà cho thuê",
    "phòng trọ giá rẻ",
    "thuê nhà nguyên căn",
    "ở ghép",
    "share phòng",
    // Location-based Vietnamese
    "thuê nhà Hà Nội",
    "thuê phòng trọ TPHCM",
    "thuê nhà Đà Nẵng",
    "phòng trọ sinh viên",
    // English keywords for expats
    "Vietnam rental",
    "apartments for rent Vietnam",
    "rooms for rent Vietnam",
    "rental properties Vietnam",
    "find rental",
    "property search",
    "real estate Vietnam",
  ],
};

export const COPYRIGHT_YEAR = new Date().getFullYear();
export const COPYRIGHT_TEXT = `© ${COPYRIGHT_YEAR} ${APP_NAME}. Đã đăng ký bản quyền.`;
