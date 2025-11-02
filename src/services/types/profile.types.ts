export type UpdateUserProfileData = {
  id: number;
  full_name: string;
  gender?: string;
  date_of_birth?: string;
  phone_number?: string;
  province_code?: string;
  district_code?: string;
  ward_code?: string;
  address?: string;
};

export type ResponseUserProfile = {
  id: number;
  full_name: string;
  gender?: string;
  date_of_birth?: string;
  phone_number?: string;
  provinces: { name: string; code: string };
  districts: { name: string; code: string; province_code: string };
  wards: { name: string; code: string; district_code: string };
  address?: string;
};
