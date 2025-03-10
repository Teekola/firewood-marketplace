import { setRequestLocale } from "next-intl/server";

import { Footer } from "@/components/footer";
import { WebsiteTopbar } from "@/components/topbar/website-topbar";
import { Locale, routing } from "@/i18n/routing";

export function generateStaticParams() {
   return routing.locales.map((locale) => ({ locale }));
}

export default async function WebsiteLayout({
   children,
   params,
}: Readonly<{
   children: React.ReactNode;
   params: Promise<{ locale: Locale }>;
}>) {
   const { locale } = await params;
   setRequestLocale(locale);

   return (
      <div className="flex h-full flex-col">
         <WebsiteTopbar />
         {children}
         <Footer />
      </div>
   );
}
