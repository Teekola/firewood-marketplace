import { Suspense } from "react";

import { setRequestLocale } from "next-intl/server";

import { NewUserDialog } from "@/components/auth/new-user-dialog";
import { Footer } from "@/components/footer";
import { WebsiteTopbar } from "@/components/topbar/website-topbar";
import { getUser } from "@/db/user";
import { Locale } from "@/i18n/routing";

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
         <Suspense fallback={<></>}>
            <NewUserDialogContainer />
         </Suspense>
      </div>
   );
}

async function NewUserDialogContainer() {
   const user = await getUser();
   return <NewUserDialog user={user} />;
}
