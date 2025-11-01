import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "@/app/globals.css";
import { NextIntlClientProvider } from "next-intl";
import NiceModalProvider from "@/components/layout/nice-modal-provider";
import AuthProvider from "@/components/layout/auth-provider";
import LocationProvider from "@/components/layout/location-provider";
import QueryProvider from "@/lib/react-query/query-provider";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rental Map",
  description: "Find your perfect rental property",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${roboto.variable} font-sans antialiased`}>
        <QueryProvider>
          <NextIntlClientProvider>
            <NiceModalProvider>
              <AuthProvider>
                <LocationProvider>{children}</LocationProvider>
              </AuthProvider>
            </NiceModalProvider>
          </NextIntlClientProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
