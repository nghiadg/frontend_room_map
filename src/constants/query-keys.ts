export const QUERY_KEYS = {
  AMENITIES: ["amenities"],
  PROPERTY_TYPES: ["property-types"],
  PROVINCES: ["provinces"],
  DISTRICTS: (provinceCode: string) => ["districts", provinceCode],
  WARDS: (districtCode: string) => ["wards", districtCode],
  USER_PROFILE: ["user-profile"],
  TERMS: ["terms"],
  POSTS: (id: string) => ["posts", id],
  POSTS_BY_MAP_BOUNDS: "posts-by-map-bounds",
};
