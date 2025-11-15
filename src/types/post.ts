import { Amenity } from "./amenities";
import { District, Province, Ward } from "./location";
import { UserProfile } from "./profile";
import { Term } from "./terms";

export type PostAmenity = {
  id: number;
  postId: number;
  amenityId: number;
  amenities: Amenity;
  createdAt?: string;
  updatedAt?: string;
};

export type PostTerm = {
  id: number;
  postId: number;
  termId: number;
  terms: Term;
  createdAt?: string;
  updatedAt?: string;
};

export type PostImage = {
  id: number;
  postId: number;
  url: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Post = {
  id: number;
  createdAt?: string;
  updatedAt?: string;
  createdBy: UserProfile;
  updatedBy: UserProfile;
  title: string;
  description: string;
  propertyTypeId: number;
  area: number;
  provinceCode: string;
  provinces: Province;
  districtCode: string;
  districts: District;
  wardCode: string;
  wards: Ward;
  address: string;
  lat: number;
  lng: number;
  price: number;
  deposit: number;
  electricityBill: number;
  waterBill: number;
  internetBill: number;
  otherBill: number;
  waterBillUnit: "month" | "m3";
  internetBillUnit: "month" | "person";

  postAmenities: PostAmenity[];
  postTerms: PostTerm[];
  postImages: PostImage[];
};
