import { District, Province, Ward } from "./location";

export type PostFormData = {
  province?: Province;
  district?: District;
  ward?: Ward;
};
