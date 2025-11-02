import { District, Province, Ward } from "./location";

export type UserProfile = {
  id: number;
  full_name: string;
  gender?: string;
  date_of_birth?: string;
  phone_number?: string;
  province?: Province;
  district?: District;
  ward?: Ward;
  address?: string;
};
