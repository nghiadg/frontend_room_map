import { District, Province, Ward } from "./location";
import { UserRole } from "@/constants/user-role";

export type UserProfile = {
  id: number;
  fullName: string;
  gender?: string;
  roleId?: number;
  roleName?: UserRole;
  dateOfBirth?: string;
  phoneNumber?: string;
  provinces?: Province;
  districts?: District;
  wards?: Ward;
  address?: string;
};
