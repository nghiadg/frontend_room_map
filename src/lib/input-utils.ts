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

export function allowOnlyCurrency(
  e: React.ChangeEvent<HTMLInputElement>,
  callback?: (value: string) => void
) {
  const value = e.target.value;
  const sanitizedValue = value.replace(ONLY_NUMBERS_REGEX, "");
  const formattedValue = String(sanitizedValue).replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ","
  );
  e.target.value = formattedValue;
  callback?.(formattedValue);
}

export function convertCurrencyToNumber(value: string): number {
  return Number(value.replace(ONLY_NUMBERS_REGEX, ""));
}

export function convertNumberToCurrency(value: number): string {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
