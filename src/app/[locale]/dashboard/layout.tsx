import { Metadata } from "next";

import { setRequestLocale } from "next-intl/server";

import { NewUserDialog } from "@/components/auth/new-user-dialog";
import { WebsiteTopbar } from "@/components/topbar/website-topbar";
import { getUser } from "@/db/user";
import { Locale, routing } from "@/i18n/routing";
import { UserStoreProvider } from "@/providers/user-store-provider";

export function generateStaticParams() {
   return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
   robots: {
      index: false,
      follow: false,
   },
};

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
         <div className="mx-auto flex w-full max-w-screen-xl flex-1 flex-col p-3">
            <UserStoreProvider user={user}>{children}</UserStoreProvider>
         </div>
         <NewUserDialog user={user} />
      </>
   );
}
