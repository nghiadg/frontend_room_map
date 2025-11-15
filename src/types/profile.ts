import { District, Province, Ward } from "./location";

export type UserProfile = {
  id: number;
  fullName: string;
  gender?: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  provinces?: Province;
  districts?: District;
  wards?: Ward;
  address?: string;
};
