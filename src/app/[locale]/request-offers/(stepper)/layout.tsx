import { getTranslations, setRequestLocale } from "next-intl/server";

import { Locale } from "@/i18n/routing";

import { PageWrapper } from "./_components/page-wrapper";
import { RequestOffersStepper } from "./_components/request-offers-stepper";

export default async function RequestOffersLayout({
   children,
   params,
}: Readonly<{
   children: React.ReactNode;
   params: Promise<{ locale: Locale }>;
}>) {
   const { locale } = await params;
   setRequestLocale(locale);
   const t = await getTranslations({ locale });

   return (
      <div className="flex h-full flex-col">
         <p className="mb-3 text-base text-foreground-muted">
            {t("request-offers.Request Offers")}
         </p>

         <RequestOffersStepper />
         <PageWrapper>{children}</PageWrapper>
      </div>
   );
}
