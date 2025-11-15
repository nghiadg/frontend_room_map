import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isDevMode() {
  return process.env.NODE_ENV === "development";
}

export function formatPrice(price: number) {
  return price.toLocaleString("en-US");
}
