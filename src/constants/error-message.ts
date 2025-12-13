export const ERROR_MESSAGE = {
  REQUIRED: "Trường này là bắt buộc",
  MAX_LENGTH: (max: number) => `Trường này không được vượt quá ${max} ký tự`,
  MUST_BE_NUMBER: "Trường này phải là số",
  MUST_FILL_ALL_INFORMATION: "Vui lòng điền đầy đủ thông tin",
  MUST_SELECT_LOCATION: "Vui lòng chọn vị trí trên bản đồ",
} as const;

/**
 * API error codes for structured error handling on frontend
 * Use these codes in API responses: { error: message, code: API_ERROR_CODE.XXX }
 */
export const API_ERROR_CODE = {
  PHONE_REQUIRED: "PHONE_REQUIRED",
} as const;

export type ApiErrorCode = (typeof API_ERROR_CODE)[keyof typeof API_ERROR_CODE];
