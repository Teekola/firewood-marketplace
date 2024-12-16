import { getTranslations } from "next-intl/server";

import { AbandonRequestDialog } from "./(components)/abandon-request-dialog";
import { PageWrapper } from "./(components)/page-wrapper";
import { RequestOffersStepper } from "./(components)/request-offers-stepper";
import { RequestOffersStoreProvider } from "./store/request-offers-store-provider";

export default async function RequestOffersLayout({
   children,
}: Readonly<{ children: React.ReactNode }>) {
   const t = await getTranslations();

   return (
      <div className="mx-auto max-w-lg p-3">
         <p className="mb-3 text-base text-muted-foreground">
            {t("request-offers.Request Offers")}
         </p>
         <RequestOffersStoreProvider>
            <RequestOffersStepper />

            <PageWrapper>{children}</PageWrapper>
            <AbandonRequestDialog className="mt-5" />
         </RequestOffersStoreProvider>
      </div>
   );
}
