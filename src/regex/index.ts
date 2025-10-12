export const ONLY_NUMBERS_REGEX = /[^0-9]/g;

// Allows formats like: 0912345678, 091 234 5678, 091-234-5678, 091.234.5678
export const VN_PHONE_REGEX =
  /^(0)(3|5|7|8|9|2)[\s.-]?[0-9]{3}[\s.-]?[0-9]{3}[\s.-]?[0-9]{3}$/;
