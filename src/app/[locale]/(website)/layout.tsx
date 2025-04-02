import { setRequestLocale } from "next-intl/server";

import { NewUserDialog } from "@/components/auth/new-user-dialog";
import { Footer } from "@/components/footer";
import { WebsiteTopbar } from "@/components/topbar/website-topbar";
import { getUser } from "@/db/user";
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
   const [{ locale }, user] = await Promise.all([params, getUser()]);

   setRequestLocale(locale);

   return (
      <div className="flex h-full flex-col">
         <WebsiteTopbar />
         {children}
         <Footer />
         <NewUserDialog user={user} />
      </div>
   );
}
