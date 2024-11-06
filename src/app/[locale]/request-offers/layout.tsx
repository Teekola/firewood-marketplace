import { getTranslations } from "next-intl/server";

import { AbandonRequestDialog } from "./(components)/abandon-request-dialog";
import { RequestOffersStepper } from "./(components)/request-offers-stepper";
import { StepManager } from "./(components)/step-manager";
import { RequestOffersStoreProvider } from "./store/request-offers-store-provider";

export default async function RequestOffersLayout({
   children,
}: Readonly<{ children: React.ReactNode }>) {
   const t = await getTranslations();

   // TODO: The submit step submits the request to database
   return (
      <div className="mx-auto max-w-lg p-3">
         <p className="mb-3 text-base text-muted-foreground">
            {t("request-offers.Request Offers")}
         </p>
         <RequestOffersStoreProvider>
            <RequestOffersStepper />
            <StepManager>{children}</StepManager>
            <AbandonRequestDialog className="mt-10" />
         </RequestOffersStoreProvider>
      </div>
   );
}
