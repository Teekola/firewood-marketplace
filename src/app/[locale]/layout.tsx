import type { Metadata } from "next";

import { getMessages, getTranslations } from "next-intl/server";

import { nunitoSans } from "@/fonts/index";
import { Locale, routing } from "@/i18n/routing";
import Providers from "@/providers";

import "../globals.css";

export function generateStaticParams() {
   return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
   params,
}: {
   params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
   const { locale } = await params;
   const t = await getTranslations({ locale, namespace: "metadata" });

   return {
      title: {
         default: t("page-titles.default"),
         template: `%s | ${t("page-titles.default")}`,
      },
      description: t("page-descriptions.default"),
   };
}

export default async function RootLayout({
   children,
   params,
}: Readonly<{
   children: React.ReactNode;
   params: Promise<{ locale: Locale }>;
}>) {
   const [{ locale }, messages] = await Promise.all([params, getMessages()]);

   return (
      <html lang={locale} suppressHydrationWarning>
         <body
            className={`${nunitoSans.variable} flex h-screen min-h-screen w-full flex-col font-sans antialiased`}
         >
            <Providers messages={messages}>
               {/**TODO: Add terms and services dialog with a check on terms acceptance date to ensure acceptance of always the latest terms and privacy policy */}
               {children}
            </Providers>
         </body>
      </html>
   );
}
