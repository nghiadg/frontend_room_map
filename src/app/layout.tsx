import "@/app/globals.css";
import AuthProvider from "@/components/user/layout/auth-provider";
import LoadingGlobalProvider from "@/components/user/layout/loading-global-provider";
import LocationProvider from "@/components/user/layout/location-provider";
import NiceModalProvider from "@/components/user/layout/nice-modal-provider";
import ViewImages from "@/components/user/layout/view-images";
import { TooltipProvider } from "@/components/ui/tooltip";
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
  title: "Rental Map | Find Houses, Apartments & Rooms for Rent in Vietnam",
  description:
    "Explore thousands of houses, apartments, and rooms for rent on Rental Map. Find your perfect rental property in Vietnam with advanced search, verified listings, and detailed information.",
  keywords: [
    "rental map",
    "Vietnam rental",
    "apartments for rent",
    "houses for rent",
    "rooms for rent",
    "find rental",
    "property search",
    "real estate Vietnam",
    "rent property",
  ],
  openGraph: {
    title: "Rental Map | Find Houses, Apartments & Rooms for Rent in Vietnam",
    description:
      "Explore thousands of houses, apartments, and rooms for rent on Rental Map. Find your perfect rental property in Vietnam today.",
    type: "website",
    url: "https://rentalmap.example.com",
    siteName: "Rental Map",
    images: [
      {
        url: "https://rentalmap.example.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Rental Map - Find Rental Properties in Vietnam",
      },
    ],
    locale: "vi_VN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rental Map | Find Houses, Apartments & Rooms for Rent in Vietnam",
    description:
      "Browse the latest rental property listings on Rental Map – Vietnam's trusted marketplace for homes and apartments.",
    images: ["https://rentalmap.example.com/og-image.jpg"],
    site: "@RentalMapVN",
    creator: "@RentalMapVN",
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
