import { getTranslations, setRequestLocale } from "next-intl/server";

import { Locale, routing } from "@/i18n/routing";

import { PageWrapper } from "../_components/page-wrapper";
import { RequestOffersStepper } from "../_components/request-offers-stepper";

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
      <div className="flex h-full flex-col">
         <p className="mb-3 text-base text-muted-foreground">
            {t("request-offers.Request Offers")}
         </p>

         <RequestOffersStepper />
         <PageWrapper>{children}</PageWrapper>
      </div>
   );
}
