import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  // Static for now, we'll change this later
  const locale = "vn";

  return {
    locale,
    messages: (await import(`../lang/${locale}.json`)).default,
  };
});
