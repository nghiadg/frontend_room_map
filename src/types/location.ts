export type City = {
  code: string;
  name: string;
};

export type District = {
  code: string;
  name: string;
  cityCode: string;
};

export type Ward = {
  code: string;
  name: string;
  districtCode: string;
};
