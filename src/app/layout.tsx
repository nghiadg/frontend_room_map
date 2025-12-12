import "@/app/globals.css";
import AuthProvider from "@/components/user/layout/auth-provider";
import LoadingGlobalProvider from "@/components/user/layout/loading-global-provider";
import LocationProvider from "@/components/user/layout/location-provider";
import NiceModalProvider from "@/components/user/layout/nice-modal-provider";
import ViewImages from "@/components/user/layout/view-images";
import { TooltipProvider } from "@/components/ui/tooltip";
import { APP_BRANDING, APP_METADATA, APP_NAME } from "@/constants/app-branding";
import QueryProvider from "@/lib/react-query/query-provider";
import { createClient } from "@/lib/supabase/server";
import { Province } from "@/types/location";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: APP_METADATA.title,
  description: APP_METADATA.description,
  keywords: APP_METADATA.keywords,
  openGraph: {
    title: APP_METADATA.title,
    description: `Explore thousands of houses, apartments, and rooms for rent on ${APP_NAME}. Find your perfect rental property in Vietnam today.`,
    type: "website",
    url: APP_BRANDING.url,
    siteName: APP_NAME,
    images: [
      {
        url: APP_BRANDING.openGraph.imageUrl,
        width: 1200,
        height: 630,
        alt: `${APP_NAME} - Find Rental Properties in Vietnam`,
      },
    ],
    locale: "vi_VN",
  },
  twitter: {
    card: "summary_large_image",
    title: APP_METADATA.title,
    description: `Browse the latest rental property listings on ${APP_NAME} – Vietnam's trusted marketplace for homes and apartments.`,
    images: [APP_BRANDING.openGraph.imageUrl],
    site: APP_BRANDING.twitter.site,
    creator: APP_BRANDING.twitter.handle,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data } = await supabase.from("provinces").select("code, name");

  const provinces: Province[] = (data || []).map((province) => ({
    code: province.code,
    name: province.name,
  }));

  return (
    <html lang="vi">
      <body className={`${roboto.variable} font-sans antialiased`}>
        <QueryProvider>
          <NextIntlClientProvider>
            <NiceModalProvider>
              <AuthProvider>
                <LocationProvider provinces={provinces}>
                  <TooltipProvider delayDuration={300}>
                    <LoadingGlobalProvider>{children}</LoadingGlobalProvider>
                  </TooltipProvider>
                </LocationProvider>
              </AuthProvider>
            </NiceModalProvider>
          </NextIntlClientProvider>
        </QueryProvider>
        <ViewImages />
      </body>
    </html>
  );
}
