export const POST_STEPS_KEYS = {
  BASIC_INFORMATION: "basic-information",
  LOCATION: "location",
  PRICE_AND_TERMS: "price-and-terms",
  UPLOAD_IMAGES: "upload- images",
};

export const POST_STEPS = [
  {
    label: "Thông tin cơ bản",
    description: "Nhập thông tin cơ bản về phòng của bạn",
    key: POST_STEPS_KEYS.BASIC_INFORMATION,
    step: 1,
  },
  {
    label: "Địa chỉ",
    description: "Nhập địa chỉ chi tiết của phòng của bạn",
    key: POST_STEPS_KEYS.LOCATION,
    step: 2,
  },
  {
    label: "Giá và điều khoản",
    description: "Nhập giá và điều khoản của bạn",
    key: POST_STEPS_KEYS.PRICE_AND_TERMS,
    step: 3,
  },
  {
    label: "Hình ảnh",
    description: "Thêm hình ảnh vào bài đăng của bạn",
    key: POST_STEPS_KEYS.UPLOAD_IMAGES,
    step: 4,
  },
];
