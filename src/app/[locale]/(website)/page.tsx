import { Metadata } from "next";

import { getTranslations, setRequestLocale } from "next-intl/server";

import { Link, Locale, routing } from "@/i18n/routing";
import { authWithSeller } from "@/lib/auth/auth";
import { Button } from "@/ui/button";

export function generateStaticParams() {
   return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
   params,
}: {
   params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
   const { locale } = await params;
   const t = await getTranslations({ locale, namespace: "metadata" });

   return {
      title: t("page-titles.home"),
      description: t("page-descriptions.default"),
   };
}

export default async function Home({ params }: Readonly<{ params: Promise<{ locale: Locale }> }>) {
   const [{ locale }, auth, t] = await Promise.all([params, authWithSeller(), getTranslations()]);
   setRequestLocale(locale);

   return (
      <main className="mx-auto w-full max-w-screen-xl p-3">
         <section className="my-5 flex w-full gap-3">
            <div className="ml-0 flex w-full max-w-screen-sm flex-col gap-3">
               <h1 className="h1">{t("home-page.hero-title")}</h1>
               <p className="leading-relaxed text-foreground-muted">
                  {t("home-page.hero-subheadline")}
               </p>
               <div className="mt-2 flex gap-2">
                  <Button asChild variant="cta" size="lg">
                     <Link href="/request-offers/firewood">
                        {t("home-page.Request Firewood Offers")}
                     </Link>
                  </Button>
                  {!auth?.seller && (
                     <Button asChild variant="outline" size="lg">
                        <Link href={auth ? "/dashboard" : "/auth/register"}>
                           {t("home-page.Start Selling")}
                        </Link>
                     </Button>
                  )}
               </div>
            </div>
         </section>
      </main>
   );
}
