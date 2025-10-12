import { isDevMode } from "./utils";

type ErrorHandlerOptions = {
  message?: string;
  title?: string;
};

export function errorHandler(
  error: Error | unknown,
  options?: ErrorHandlerOptions
) {
  // TODO: Implement error handling
  const log = isDevMode() ? console.log : console.error;
  log(options?.title || "Error", options?.message || error);
}
