export const QUERY_KEYS = {
  PROVINCES: ["provinces"],
  DISTRICTS: (provinceCode: string) => ["districts", provinceCode],
  WARDS: (districtCode: string) => ["wards", districtCode],
};
