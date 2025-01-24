import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";

import { getSellerLocation } from "./actions";
import { SellerLocationForm, sellerLocationQueryKey } from "./location-form";

export default async function SellerInformationPage() {
   const t = await getTranslations("dashboard");
   const queryClient = new QueryClient();
   await queryClient.prefetchQuery({
      queryKey: [sellerLocationQueryKey],
      queryFn: getSellerLocation,
   });
   return (
      <div>
         <header>
            <h1 className="h3">{t("Seller Location")}</h1>
            <p className="mt-2">
               {t("Define location settings These affect the offers you receive")}
            </p>
         </header>
         <HydrationBoundary state={dehydrate(queryClient)}>
            <SellerLocationForm />
         </HydrationBoundary>
      </div>
   );
}
