export const ERROR_MESSAGE = {
  REQUIRED: "Trường này là bắt buộc",
  MAX_LENGTH: (max: number) => `Trường này không được vượt quá ${max} ký tự`,
  MUST_BE_NUMBER: "Trường này phải là số",
  MUST_FILL_ALL_INFORMATION: "Vui lòng điền đầy đủ thông tin",
  MUST_SELECT_LOCATION: "Vui lòng chọn vị trí trên bản đồ",
} as const;
