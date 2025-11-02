export const QUERY_KEYS = {
  PROVINCES: ["provinces"],
  DISTRICTS: (provinceCode: string) => ["districts", provinceCode],
  WARDS: (districtCode: string) => ["wards", districtCode],
  USER_PROFILE: ["user-profile"],
};
