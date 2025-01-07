import { getTranslations, setRequestLocale } from "next-intl/server";

import { AuthButton } from "@/components/auth/auth-button";
import { LanguageDropdown } from "@/components/language-dropdown/language-dropdown";
import { ThemeToggle } from "@/components/theme-toggle";
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
         <div className="bg-secondary">
            <div className="mx-auto flex max-w-screen-xl justify-between p-3">
               <div className="text-secondary-foreground-foreground my-auto text-2xl font-extrabold">
                  {"Polttopuutori"}
               </div>

               <div className="rounded bg-card"></div>
               <div className="flex">
                  <section className="flex justify-between gap-1">
                     <LanguageDropdown />
                     <ThemeToggle />
                  </section>
                  <section className="flex min-w-36 justify-end">
                     <AuthButton />
                  </section>
               </div>
            </div>
         </div>
         <main className="mx-auto max-w-screen-xl p-3">
            <Button asChild>
               <Link href="/request-offers/firewood">{t("Request Offers")}</Link>
            </Button>
         </main>
      </>
   );
}
