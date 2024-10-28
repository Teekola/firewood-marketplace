import { getTranslations } from "next-intl/server";

import { AbandonRequestDialog } from "./(components)/abandon-request-dialog";
import { RequestOffersStoreProvider } from "./store/request-offers-store-provider";

export default async function RequestOffersLayout({
   children,
}: Readonly<{ children: React.ReactNode }>) {
   const t = await getTranslations();

   // TODO: Create a form for each step using shadcn (react-hook-form)
   // TODO: Store the submitted values for each step in the store and use them for populating the form fields
   // TODO: The submit step submits the request to database
   // TODO: Create appropriate form fields for each form
   // TODO: Add Google Geocoding API integration for Postal code field
   // TODO: Persist the store data in session storage
   return (
      <div className="mx-auto max-w-screen-lg p-3">
         <p className="text-base text-muted-foreground">{t("request-offers.Request Offers")}</p>
         <RequestOffersStoreProvider>{children}</RequestOffersStoreProvider>
         <AbandonRequestDialog className="mt-10" />
      </div>
   );
}
