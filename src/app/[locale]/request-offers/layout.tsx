import { setRequestLocale } from "next-intl/server";

import { RequestOffersTopbar } from "@/app/[locale]/request-offers/_components/request-offers-topbar";
import { Footer } from "@/components/footer";
import { Locale, routing } from "@/i18n/routing";

import { RequestOffersStoreProvider } from "./_store/request-offers-store-provider";

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
      <div className="flex flex-1 flex-col">
         <RequestOffersStoreProvider>
            <RequestOffersTopbar />
            <div className="mx-auto h-full w-full max-w-lg p-3">{children}</div>
         </RequestOffersStoreProvider>
         <Footer />
      </div>
   );
}
