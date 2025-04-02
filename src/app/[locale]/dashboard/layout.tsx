import { setRequestLocale } from "next-intl/server";

import { NewUserDialog } from "@/components/auth/new-user-dialog";
import { WebsiteTopbar } from "@/components/topbar/website-topbar";
import { getUser } from "@/db/user";
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
   const [{ locale }, user] = await Promise.all([params, getUser()]);
   setRequestLocale(locale);

   return (
      <>
         <WebsiteTopbar />
         <div className="mx-auto h-full w-full max-w-screen-xl p-3">{children}</div>
         <NewUserDialog user={user} />
      </>
   );
}
