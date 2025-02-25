import { setRequestLocale } from "next-intl/server";

import { Topbar } from "@/components/topbar";
import { Locale, routing } from "@/i18n/routing";

export function generateStaticParams() {
   return routing.locales.map((locale) => ({ locale }));
}

export default async function DashboardLayout({
   children,
   params,
}: Readonly<{
   children: React.ReactNode;
   params: Promise<{ locale: Locale }>;
}>) {
   const { locale } = await params;
   setRequestLocale(locale);

   return (
      <>
         <Topbar />
         <div
            className="mx-auto h-full w-full max-w-screen-xl p-3"
            style={{ height: "calc(100% - 220px)" }} // TODO: Might need modifications, needed for quotation request list
         >
            {children}
         </div>
      </>
   );
}
