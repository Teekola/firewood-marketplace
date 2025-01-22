import { getTranslations, setRequestLocale } from "next-intl/server";

import { NewUserDialog } from "@/components/auth/new-user-dialog";
import { Topbar } from "@/components/topbar";
import { Link, Locale, routing } from "@/i18n/routing";
import { Button } from "@/ui/button";

export function generateStaticParams() {
   return routing.locales.map((locale) => ({ locale }));
}

export default async function Home({ params }: Readonly<{ params: Promise<{ locale: Locale }> }>) {
   const { locale } = await params;
   setRequestLocale(locale);

   const t = await getTranslations("request-offers");
   return (
      <>
         <Topbar />
         <main className="mx-auto max-w-screen-xl p-3">
            <Button asChild>
               <Link href="/request-offers/firewood">{t("Request Offers")}</Link>
            </Button>
         </main>
         <NewUserDialog />
      </>
   );
}
