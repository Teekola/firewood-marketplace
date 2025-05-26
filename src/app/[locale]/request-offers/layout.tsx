import { Metadata } from "next";

import { setRequestLocale } from "next-intl/server";

import { RequestOffersTopbar } from "@/app/[locale]/request-offers/_components/request-offers-topbar";
import { Footer } from "@/components/footer";
import { getUser } from "@/db/user";
import { Locale } from "@/i18n/routing";
import { UserStoreProvider } from "@/providers/user-store-provider";

import { RequestOffersStoreProvider } from "./_store/request-offers-store-provider";

export const metadata: Metadata = {
   robots: {
      index: false,
      follow: true,
   },
};

export default async function RequestOffersLayout({
   children,
   params,
}: Readonly<{
   children: React.ReactNode;
   params: Promise<{ locale: Locale }>;
}>) {
   const [{ locale }, user] = await Promise.all([params, getUser()]);
   setRequestLocale(locale);

   return (
      <div className="flex flex-1 flex-col">
         <RequestOffersStoreProvider>
            <RequestOffersTopbar />
            <div className="mx-auto h-full w-full max-w-lg p-3">
               <UserStoreProvider user={user}>{children}</UserStoreProvider>
            </div>
         </RequestOffersStoreProvider>
         <Footer />
      </div>
   );
}
