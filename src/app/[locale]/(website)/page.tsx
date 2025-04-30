import { Metadata } from "next";

import { getTranslations, setRequestLocale } from "next-intl/server";
import { Action, Offer, WebPage } from "schema-dts";

import { env } from "@/env/client";
import { Link, Locale, localeToLanguageName, routing } from "@/i18n/routing";
import { getLocalizedPath } from "@/i18n/utils/get-localized-path";
import { JsonLd } from "@/lib/utils/json-ld";
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
      description: t("page-descriptions.home"),
      alternates: {
         canonical: getLocalizedPath("/", locale),
      },
   };
}

export default async function Home({ params }: Readonly<{ params: Promise<{ locale: Locale }> }>) {
   const [{ locale }, t] = await Promise.all([params, getTranslations()]);
   setRequestLocale(locale);

   // SchemaMarkup
   const webPageJsonLd = JsonLd<WebPage>({
      "@context": "https://schema.org",
      "@type": "WebPage",
      url: `${env.NEXT_PUBLIC_BASE_URL}/`,
      name: t("metadata.page-titles.home"),
      description: t("metadata.page-descriptions.home"),
      inLanguage: locale,

      publisher: {
         "@type": "Organization",
         name: t("company.name"),
         url: env.NEXT_PUBLIC_BASE_URL,
         // TODO: Add logo
         // logo: `${env.NEXT_PUBLIC_BASE_URL}/logo.png`,
         // TODO: Add correct contact information
         contactPoint: {
            "@type": "ContactPoint",
            contactType: t("company.customer-service"),
            email: t("company.email"),
            areaServed: [
               { "@type": "Place", name: "FI" },
               { "@type": "Place", name: "US" },
            ],
            availableLanguage: routing.locales.map((locale) => {
               return localeToLanguageName[locale];
            }),
         },
      },

      mainEntityOfPage: {
         "@type": "WebPage",
         "@id": `${env.NEXT_PUBLIC_BASE_URL}/`,
      },
   });

   const requestOffersJsonLd = JsonLd<Offer>({
      "@context": "https://schema.org",
      "@type": "Offer",
      url: `${env.NEXT_PUBLIC_BASE_URL}/request-offers/firewood`,
      name: t("home-page.Request Firewood Offers"),
      description: t("home-page.request-offers-description"),
      price: t("home-page.request-offers-service-price"),
      availability: "https://schema.org/InStock",
      eligibleRegion: [
         {
            "@type": "Place",
            name: "FI",
         },
         {
            "@type": "Place",
            name: "US",
         },
      ],
      itemOffered: {
         "@type": "Service",
         serviceType: t("home-page.request-offers-service-type"),
         provider: {
            "@type": "Organization",
            name: t("company.name"),
         },
      },
   });

   const startSellingJsonLd = JsonLd<Action>({
      "@context": "https://schema.org",
      "@type": "Action",
      name: t("home-page.Start Selling"),
      description: t("home-page.start-selling-description"),
      target: {
         "@type": "EntryPoint",
         urlTemplate: `${env.NEXT_PUBLIC_BASE_URL}/register`, // TODO: add a custom page for registering as a seller
         actionPlatform: "Web",
      },
      agent: {
         "@type": "Organization",
         name: t("company.name"),
      },
   });

   return (
      <>
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

                     <Button asChild variant="outline" size="lg">
                        <Link href="/dashboard">{t("home-page.Start Selling")}</Link>
                     </Button>
                  </div>
               </div>
            </section>
         </main>
         <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: webPageJsonLd }} />
         <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: requestOffersJsonLd }}
         />
         <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: startSellingJsonLd }}
         />
      </>
   );
}
