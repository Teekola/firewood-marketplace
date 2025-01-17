import { setRequestLocale } from "next-intl/server";

import { Locale, routing } from "@/i18n/routing";

import { RequestOffersStoreProvider } from "./(store)/request-offers-store-provider";

export function generateStaticParams() {
   return routing.locales.map((locale) => ({ locale }));
}

export default async function RequestOffersLayout({
   children,
   params,
}: Readonly<{
   children: React.ReactNode;
   params: Promise<{ locale: Locale }>;
}>) {
   const { locale } = await params;
   setRequestLocale(locale);

   return (
      <div className="mx-auto max-w-lg p-3">
         <RequestOffersStoreProvider>{children}</RequestOffersStoreProvider>
      </div>
   );
}
