import { ONLY_NUMBERS_REGEX } from "@/regex";

export function allowOnlyNumbers(
  e: React.ChangeEvent<HTMLInputElement>,
  callback?: (value: string) => void
) {
  const value = e.target.value;
  const sanitizedValue = value.replace(ONLY_NUMBERS_REGEX, "");
  e.target.value = sanitizedValue;
  callback?.(sanitizedValue);
}
