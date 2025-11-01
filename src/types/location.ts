export type Province = {
  code: string;
  name: string;
};

export type District = {
  code: string;
  name: string;
  provinceCode: string;
};

export type Ward = {
  code: string;
  name: string;
  districtCode: string;
};
