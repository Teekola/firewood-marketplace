import { getTranslations, setRequestLocale } from "next-intl/server";

import { Locale, routing } from "@/i18n/routing";

import { AbandonRequestDialog } from "../(components)/abandon-request-dialog";
import { PageWrapper } from "../(components)/page-wrapper";
import { RequestOffersStepper } from "../(components)/request-offers-stepper";

export function generateStaticParams() {
   return routing.locales.map((locale) => ({ locale }));
}

export default async function RequestOffersLayout({
   children,
   params,
}: Readonly<{
   children: React.ReactNode;
   params: Promise<{ locale: Locale }>;
}>) {
   const { locale } = await params;
   setRequestLocale(locale);

   const t = await getTranslations();

   return (
      <>
         <p className="mb-3 text-base text-muted-foreground">
            {t("request-offers.Request Offers")}
         </p>

         <RequestOffersStepper />
         <PageWrapper>{children}</PageWrapper>
         <AbandonRequestDialog className="mt-5" />
      </>
   );
}
